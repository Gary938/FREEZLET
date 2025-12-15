// ❌ Incorrect answer effect — portal disappearance + burn (original HTML style)
export function applyEffect(button) {
  // Ensure basic structure
  button.style.overflow = 'hidden';
  button.style.position = 'relative';
  if (button.parentElement) button.parentElement.style.overflow = 'visible';
  if (button.parentElement?.parentElement) button.parentElement.parentElement.style.overflow = 'visible';

  // Add burn under button
  const burn = document.createElement('div');
  burn.className = 'portal-mark';
  burn.style.position = 'absolute';
  burn.style.inset = '0';
  burn.style.background = '#000';
  burn.style.borderRadius = 'inherit';
  burn.style.zIndex = '0';
  burn.style.opacity = '1';
  burn.style.pointerEvents = 'none';
  button.insertBefore(burn, button.firstChild);

  // Create visual button clone without internal effects
  const clone = document.createElement('button');
  clone.className = 'portal-button portal-effect';
  clone.disabled = true;
  clone.textContent = button.textContent;
  clone.style.position = 'absolute';
  clone.style.inset = '0';
  clone.style.borderRadius = 'inherit';
  clone.style.zIndex = '1';

  button.appendChild(clone);

  // Remove only clone after effect completion
  setTimeout(() => clone.remove(), 1500);

  // Add styles if not already added
  if (!document.getElementById('portal-style')) {
    const style = document.createElement('style');
    style.id = 'portal-style';
    style.textContent = `
      @keyframes portalSpin {
        0% {
          transform: scale(1) rotate(0deg);
          opacity: 1;
          clip-path: circle(100% at 50% 50%);
        }
        60% {
          transform: scale(0.6) rotate(180deg);
          clip-path: circle(40% at 50% 50%);
        }
        100% {
          transform: scale(0) rotate(360deg);
          opacity: 0;
          clip-path: circle(0% at 50% 50%);
        }
      }

      .portal-effect {
        animation: portalSpin 1.5s ease-in forwards;
      }

      .portal-mark {
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
