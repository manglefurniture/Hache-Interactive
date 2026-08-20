(() => {
  const style = document.createElement('style');
  style.textContent = `
    .hache-demo-notice{position:fixed;z-index:2147483647;left:50%;top:24px;transform:translate(-50%,-18px);width:min(calc(100vw - 28px),720px);padding:24px 58px 24px 26px;border:1px solid rgba(255,255,255,.22);border-radius:22px;background:rgba(8,10,9,.88);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);box-shadow:0 28px 90px rgba(0,0,0,.5);color:#fff;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;opacity:0;transition:opacity .35s ease,transform .35s ease;pointer-events:auto}
    .hache-demo-notice.show{opacity:1;transform:translate(-50%,0)}
    .hache-demo-notice.hide{opacity:0;transform:translate(-50%,-12px)}
    .hache-demo-notice strong{display:block;font-size:22px;line-height:1.15;margin-bottom:10px;letter-spacing:-.02em}
    .hache-demo-notice p{margin:0;color:rgba(255,255,255,.86);font-size:16px;line-height:1.5}
    .hache-demo-notice a{display:inline-block;margin-top:10px;color:#b7ff00;font-weight:900;font-size:16px;text-decoration:none;white-space:nowrap}
    .hache-demo-notice button{position:absolute;right:14px;top:12px;border:0;background:rgba(255,255,255,.08);color:#fff;font-size:22px;line-height:1;cursor:pointer;width:34px;height:34px;border-radius:50%;padding:0}
    @media(max-width:600px){.hache-demo-notice{top:12px;width:calc(100vw - 18px);padding:22px 48px 22px 20px;border-radius:18px}.hache-demo-notice strong{font-size:20px}.hache-demo-notice p{font-size:15px;line-height:1.45}.hache-demo-notice a{font-size:15px;margin-top:10px}.hache-demo-notice button{right:10px;top:10px}}
  `;
  document.head.appendChild(style);

  const notice = document.createElement('div');
  notice.className = 'hache-demo-notice';
  notice.setAttribute('role','status');
  notice.innerHTML = `<button aria-label="Cerrar">×</button><strong>Este sitio es una demostración.</strong><p>Es un ejemplo de lo que podemos crear para tu negocio.</p><a href="https://wa.me/529982655834?text=Hola%20Hache%20Interactive%2C%20vi%20uno%20de%20sus%20demos%20y%20quiero%20cotizar" target="_blank" rel="noopener">Cotiza directo por WhatsApp →</a>`;
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