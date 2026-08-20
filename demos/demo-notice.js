(() => {
  if (sessionStorage.getItem('hacheDemoNoticeSeen') === '1') return;
  sessionStorage.setItem('hacheDemoNoticeSeen', '1');

  const style = document.createElement('style');
  style.textContent = `
    .hache-demo-notice{position:fixed;z-index:2147483647;left:50%;top:22px;transform:translate(-50%,-14px);width:min(calc(100vw - 28px),560px);padding:16px 18px;border:1px solid rgba(255,255,255,.18);border-radius:16px;background:rgba(8,10,9,.78);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);box-shadow:0 20px 60px rgba(0,0,0,.35);color:#fff;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;opacity:0;transition:opacity .35s ease,transform .35s ease;pointer-events:auto}
    .hache-demo-notice.show{opacity:1;transform:translate(-50%,0)}
    .hache-demo-notice.hide{opacity:0;transform:translate(-50%,-10px)}
    .hache-demo-notice strong{display:block;font-size:15px;line-height:1.25;margin-bottom:5px;letter-spacing:-.01em}
    .hache-demo-notice p{margin:0;color:rgba(255,255,255,.78);font-size:13px;line-height:1.45}
    .hache-demo-notice a{color:#b7ff00;font-weight:800;text-decoration:none;white-space:nowrap}
    .hache-demo-notice button{position:absolute;right:10px;top:8px;border:0;background:transparent;color:rgba(255,255,255,.65);font-size:20px;line-height:1;cursor:pointer;padding:5px}
    @media(max-width:600px){.hache-demo-notice{top:12px;width:calc(100vw - 20px);padding:14px 40px 14px 15px;border-radius:14px}.hache-demo-notice strong{font-size:14px}.hache-demo-notice p{font-size:12px}}
  `;
  document.head.appendChild(style);

  const notice = document.createElement('div');
  notice.className = 'hache-demo-notice';
  notice.setAttribute('role','status');
  notice.innerHTML = `<button aria-label="Cerrar">×</button><strong>Este sitio es una demostración.</strong><p>Es un ejemplo de lo que podemos crear para tu negocio. <a href="https://wa.me/529982655834?text=Hola%20Hache%20Interactive%2C%20vi%20uno%20de%20sus%20demos%20y%20quiero%20cotizar" target="_blank" rel="noopener">Cotiza por WhatsApp →</a></p>`;
  document.body.appendChild(notice);

  requestAnimationFrame(() => notice.classList.add('show'));
  const dismiss = () => {
    notice.classList.remove('show');
    notice.classList.add('hide');
    setTimeout(() => notice.remove(), 380);
  };
  notice.querySelector('button').addEventListener('click', dismiss);
  setTimeout(dismiss, 5000);
})();