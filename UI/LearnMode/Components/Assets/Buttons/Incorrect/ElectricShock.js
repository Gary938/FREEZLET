// ✅ ElectricShock effect — for incorrect answer (burn strictly inside button, stays under text)
export function applyEffect(button) {
  button.style.overflow = 'hidden';
  button.style.position = 'relative';

  if (button.parentElement) button.parentElement.style.overflow = 'visible';
  if (button.parentElement?.parentElement) button.parentElement.parentElement.style.overflow = 'visible';

  button.classList.add('shocking');

  const style = document.createElement('style');
  style.id = 'shock-style';
  style.textContent = `
    @keyframes shakeFlash {
      0%, 100% { background: #fff; transform: scale(1) skewX(0deg); }
      10% { background: #e0e0ff; transform: scale(1.05) skewX(-5deg); }
      20% { background: #fff; transform: scale(0.98) skewX(5deg); }
      30% { background: #ddeeff; transform: scale(1.02) skewX(-3deg); }
      50% { background: #ffffff; transform: scale(1) skewX(3deg); }
      70% { background: #cfcfff; transform: scale(0.97) skewX(-2deg); }
    }

    @keyframes shockFade {
      0% { opacity: 1; filter: none; }
      100% { opacity: 0; filter: blur(2px); }
    }

    .shocking {
      animation: shakeFlash 0.8s ease-in-out, shockFade 1.4s ease-out forwards;
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

    .shocking > *:not(.burn-mark) {
      position: relative;
      z-index: 1;
    }
  `;
  if (!document.getElementById('shock-style')) document.head.appendChild(style);

  const burn = document.createElement('div');
  burn.className = 'burn-mark';
  button.insertBefore(burn, button.firstChild);

  setTimeout(() => {
    button.classList.remove('shocking');
    // burn stays
  }, 1400);
}