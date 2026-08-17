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

document.querySelector('.menu-toggle')?.addEventListener('click', () => {
  const nav = document.querySelector('.nav');
  const open = nav.dataset.open === '1';
  nav.dataset.open = open ? '0' : '1';
  if (!open) {
    nav.style.display = 'flex'; nav.style.position='absolute'; nav.style.top='72px'; nav.style.left='20px'; nav.style.right='20px'; nav.style.flexDirection='column'; nav.style.padding='22px'; nav.style.background='#0b0d0c'; nav.style.border='1px solid #20241f'; nav.style.borderRadius='14px';
  } else nav.style.display = 'none';
});