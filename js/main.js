const obs = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

const sections = [...document.querySelectorAll('main section[id]')];
const links = [...document.querySelectorAll('.nav a')];
window.addEventListener('scroll', () => {
  const y = window.scrollY + 180;
  let current = 'inicio';
  sections.forEach(s => { if (s.offsetTop <= y) current = s.id; });
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
});

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

function setMenu(open) {
  if (!menuToggle || !nav) return;
  nav.dataset.open = open ? '1' : '0';
  menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');

  if (open) {
    nav.style.display = 'flex';
    nav.style.position = 'absolute';
    nav.style.top = '72px';
    nav.style.left = '20px';
    nav.style.right = '20px';
    nav.style.flexDirection = 'column';
    nav.style.padding = '22px';
    nav.style.background = '#0b0d0c';
    nav.style.border = '1px solid #20241f';
    nav.style.borderRadius = '14px';
  } else {
    nav.style.display = 'none';
  }
}

menuToggle?.addEventListener('click', () => setMenu(nav?.dataset.open !== '1'));

nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.matchMedia('(max-width: 900px)').matches) setMenu(false);
  });
});

window.addEventListener('resize', () => {
  if (!nav || !menuToggle) return;
  if (!window.matchMedia('(max-width: 900px)').matches) {
    nav.removeAttribute('style');
    nav.dataset.open = '0';
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
  }
});
