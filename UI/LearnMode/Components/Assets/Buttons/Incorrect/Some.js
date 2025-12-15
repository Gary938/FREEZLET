export function applyEffect(button) {
  button.style.overflow = 'hidden';
  button.style.position = 'relative';

  const burn = document.createElement('div');
  burn.className = 'burn-mark';
  burn.style.position = 'absolute';
  burn.style.inset = '0';
  burn.style.background = '#000';
  burn.style.borderRadius = 'inherit';
  burn.style.zIndex = '0';
  burn.style.opacity = '1';
  burn.style.pointerEvents = 'none';
  button.insertBefore(burn, button.firstChild);

  const rect = button.getBoundingClientRect();
  const clone = button.cloneNode(true);
  clone.disabled = true;
  clone.classList.add('explode');
  clone.style.position = 'absolute';
  clone.style.left = `${rect.left + window.scrollX}px`;
  clone.style.top = `${rect.top + window.scrollY}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.zIndex = '1000';
  clone.style.fontFamily = getComputedStyle(button).fontFamily;
  clone.style.fontSize = getComputedStyle(button).fontSize;
  clone.style.color = getComputedStyle(button).color;
  clone.style.border = getComputedStyle(button).border;
  clone.style.borderRadius = getComputedStyle(button).borderRadius;
  clone.style.background = getComputedStyle(button).background;
  clone.style.display = 'flex';
  clone.style.alignItems = 'center';
  clone.style.justifyContent = 'center';

  clone.textContent = button.textContent;
  document.body.appendChild(clone);

  const after = document.createElement('div');
  after.className = 'button-burst';
  after.style.position = 'absolute';
  after.style.width = '200%';
  after.style.height = '200%';
  after.style.top = '50%';
  after.style.left = '50%';
  after.style.transform = 'translate(-50%, -50%) scale(0.1)';
  after.style.opacity = '0.8';
  after.style.pointerEvents = 'none';
  after.style.borderRadius = '50%';
  after.style.background = 'radial-gradient(circle, #f44336 10%, transparent 70%)';
  after.style.animation = 'burst 0.4s ease-out forwards';
  clone.appendChild(after);

  setTimeout(() => {
    clone.remove();
  }, 700);

  if (!document.getElementById('burst-style')) {
    const style = document.createElement('style');
    style.id = 'burst-style';
    style.textContent = `
      .explode {
        animation: explodeOut 0.6s ease-in-out forwards;
      }

      @keyframes explodeOut {
        0%   { transform: scale(1) rotate(0deg); opacity: 1; }
        100% { transform: scale(2.5) rotate(60deg); opacity: 0; }
      }

      @keyframes burst {
        to {
          transform: translate(-50%, -50%) scale(1.5);
          opacity: 0;
        }
      }

      .burn-mark {
        position: absolute;
        inset: 0;
        background: #000;
        border-radius: inherit;
        z-index: 0;
        opacity: 1;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  }
}