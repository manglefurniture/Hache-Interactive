#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const target = path.resolve(process.argv[2] || '.');
const failures = [];
const warnings = [];

const fail = (id, message) => failures.push(`${id} FAIL ${message}`);
const warn = (id, message) => warnings.push(`${id} WARNING ${message}`);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'vendor'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function attr(tag, name) {
  const re = new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i');
  return tag.match(re)?.[2] ?? null;
}

function hasAccessibleName(html, inputTag) {
  if (attr(inputTag, 'aria-label')?.trim()) return true;
  if (attr(inputTag, 'aria-labelledby')?.trim()) return true;
  const id = attr(inputTag, 'id');
  if (!id) return false;
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`<label\\b[^>]*\\bfor\\s*=\\s*(["'])${escaped}\\1`, 'i').test(html);
}

function isDemo(rel) {
  return rel.replaceAll('\\', '/').startsWith('demos/');
}

function checkHtml(file) {
  const rel = path.relative(target, file) || path.basename(file);
  const html = fs.readFileSync(file, 'utf8');
  const demo = isDemo(rel);

  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, '').trim();
  if (!title) fail('SEO-ONPAGE-001', `${rel}: missing/empty <title>`);

  if (!/<meta\b[^>]*name\s*=\s*(["'])viewport\1[^>]*>/i.test(html)) {
    fail('SEO-MOBILE-001', `${rel}: viewport meta missing`);
  }

  const robotsTag = html.match(/<meta\b[^>]*name\s*=\s*(["'])robots\1[^>]*>/i)?.[0] || '';
  const robotsContent = attr(robotsTag, 'content') || '';
  const hasNoindex = /(?:^|[,\s])noindex(?:[,\s]|$)/i.test(robotsContent);
  const hasFollow = /(?:^|[,\s])follow(?:[,\s]|$)/i.test(robotsContent);

  if (demo) {
    if (!hasNoindex || !hasFollow) {
      fail('SEO-DEMO-001', `${rel}: demo must deliver static robots noindex,follow in HTML`);
    }
    if (!/<script\b[^>]*src\s*=\s*(["'])\.\.\/demo-notice\.js\1[^>]*><\/script>/i.test(html)) {
      fail('SEO-DEMO-002', `${rel}: demo must load ../demo-notice.js for the conceptual-project notice`);
    }
  } else if (path.basename(rel).toLowerCase() === 'index.html' && hasNoindex) {
    fail('SEO-INDEX-001', `${rel}: primary public page must remain indexable`);
  }

  const canonicals = [...html.matchAll(/<link\b[^>]*rel\s*=\s*(["'])canonical\1[^>]*>/gi)];
  if (!demo) {
    if (canonicals.length !== 1) {
      fail('SEO-INDEX-002', `${rel}: expected exactly one canonical, found ${canonicals.length}`);
    } else {
      const href = attr(canonicals[0][0], 'href');
      if (!href || !/^https:\/\//i.test(href)) fail('SEO-INDEX-002', `${rel}: canonical must be absolute HTTPS`);
    }
  } else if (canonicals.length > 1) {
    fail('SEO-INDEX-003', `${rel}: demo has multiple canonicals`);
  }

  if (!/<h1\b[^>]*>[\s\S]*?<\/h1>/i.test(html)) {
    warn('SEO-ONPAGE-002', `${rel}: no H1 found; verify visible primary context`);
  }

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    if (attr(match[0], 'alt') === null) fail('SEO-A11Y-001', `${rel}: image missing alt attribute`);
  }

  if (!demo) {
    for (const match of html.matchAll(/<(?:input|select|textarea)\b[^>]*>/gi)) {
      const tag = match[0];
      const type = (attr(tag, 'type') || '').toLowerCase();
      if (['hidden', 'submit', 'button', 'reset', 'image'].includes(type)) continue;
      if (!hasAccessibleName(html, tag)) fail('SEO-A11Y-002', `${rel}: form control lacks accessible name`);
    }
  }

  for (const match of html.matchAll(/<script\b[^>]*type\s*=\s*(["'])application\/ld\+json\1[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[2].trim());
    } catch {
      fail('SEO-SCHEMA-001', `${rel}: invalid JSON-LD`);
    }
  }
}

function createDemoNoticeDocument() {
  const createElement = (tagName) => {
    const children = [];
    return {
      tagName: tagName.toUpperCase(),
      children,
      className: '',
      innerHTML: '',
      textContent: '',
      classList: { add() {}, remove() {} },
      setAttribute() {},
      appendChild(child) {
        children.push(child);
        return child;
      },
      querySelector(selector) {
        return selector === 'button' && this.innerHTML.includes('<button')
          ? { addEventListener() {} }
          : null;
      },
      remove() {},
    };
  };

  return { head: createElement('head'), body: createElement('body'), createElement };
}

function rendersDemoNotice(script) {
  const document = createDemoNoticeDocument();
  try {
    vm.runInNewContext(script, {
      document,
      requestAnimationFrame(callback) { callback(); },
      setTimeout() { return 0; },
    }, { filename: 'demos/demo-notice.js', timeout: 1000 });
  } catch {
    return false;
  }

  return document.body.children.some((element) => (
    element.tagName === 'DIV'
    && element.className === 'hache-demo-notice'
    && element.innerHTML.includes('Este sitio es una demostración.')
  ));
}

function checkDemoNotice() {
  const file = path.join(target, 'demos', 'demo-notice.js');
  if (!fs.existsSync(file)) {
    fail('SEO-DEMO-003', 'demos/demo-notice.js missing');
    return;
  }

  const script = fs.readFileSync(file, 'utf8');
  if (!rendersDemoNotice(script)) {
    fail('SEO-DEMO-004', 'demos/demo-notice.js must create and append the conceptual-project notice');
  }

  // Impide que una implementación completa dentro de un comentario pase la prueba.
  const commentedOutScript = `/*\n${script.replaceAll('*/', '* /')}\n*/`;
  if (rendersDemoNotice(commentedOutScript)) {
    fail('SEO-DEMO-005', 'commented-out demo notice implementation must not pass');
  }
}

function checkRobots() {
  const file = path.join(target, 'robots.txt');
  if (!fs.existsSync(file)) {
    fail('SEO-CRAWL-001', 'robots.txt missing');
    return;
  }
  const text = fs.readFileSync(file, 'utf8');
  if (/User-agent:\s*\*[\s\S]*Disallow:\s*\/\s*$/im.test(text)) {
    fail('SEO-CRAWL-002', 'robots.txt contains global Disallow: /');
  }
  if (!/Sitemap:\s*https:\/\/hacheinteractive\.com\/sitemap\.xml/i.test(text)) {
    fail('SEO-CRAWL-003', 'robots.txt must reference the canonical sitemap');
  }
}

function checkSitemap() {
  const file = path.join(target, 'sitemap.xml');
  if (!fs.existsSync(file)) {
    fail('SEO-SITEMAP-001', 'sitemap.xml missing');
    return;
  }
  const xml = fs.readFileSync(file, 'utf8');
  if (!/<urlset\b/i.test(xml)) fail('SEO-SITEMAP-001', 'sitemap.xml has no urlset root');
  if (!/<loc>https:\/\/hacheinteractive\.com\/<\/loc>/i.test(xml)) {
    fail('SEO-SITEMAP-002', 'homepage canonical missing from sitemap');
  }
  if (/\/demos\//i.test(xml)) {
    fail('SEO-SITEMAP-003', 'fictional demos must not be listed in sitemap');
  }
}

if (!fs.existsSync(target) || !fs.statSync(target).isDirectory()) {
  console.error(`SEO_STATIC_FAIL target is not a directory: ${target}`);
  process.exit(2);
}

for (const file of walk(target).filter((f) => /\.html?$/i.test(f))) checkHtml(file);
checkDemoNotice();
checkRobots();
checkSitemap();

for (const line of warnings) console.warn(line);
for (const line of failures) console.error(line);

if (failures.length) {
  console.error(`SEO_STATIC_FAIL failures=${failures.length} warnings=${warnings.length}`);
  process.exit(1);
}

console.log(`SEO_STATIC_OK warnings=${warnings.length}`);
