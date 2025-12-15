// ❌ Incorrect answer effect — smoke disappearance + burn (ElectricShock style, fixed cloning)
export function applyEffect(button) {
  // Ensure basic structure
  button.style.overflow = 'hidden';
  button.style.position = 'relative';
  if (button.parentElement) button.parentElement.style.overflow = 'visible';
  if (button.parentElement?.parentElement) button.parentElement.parentElement.style.overflow = 'visible';

  // Add burn inside button
  const burn = document.createElement('div');
  burn.className = 'burn-mark';
  button.insertBefore(burn, button.firstChild);

  // Create separate clone without internal elements (without burn)
  const clone = document.createElement('div');
  clone.className = 'dissolving';
  clone.style.position = 'absolute';
  clone.style.inset = '0';
  clone.style.margin = '0';
  clone.style.zIndex = '1';
  clone.style.display = 'flex';
  clone.style.alignItems = 'center';
  clone.style.justifyContent = 'center';
  clone.style.borderRadius = getComputedStyle(button).borderRadius;
  clone.style.background = getComputedStyle(button).background;
  clone.style.color = getComputedStyle(button).color;
  clone.style.font = getComputedStyle(button).font;
  clone.textContent = button.textContent;

  button.appendChild(clone);

  // Remove only clone after effect completion
  setTimeout(() => clone.remove(), 2500);

  // Add styles if not already added
  if (!document.getElementById('smoke-style')) {
    const style = document.createElement('style');
    style.id = 'smoke-style';
    style.textContent = `
      @keyframes smokeAway {
        0% {
          opacity: 1;
          filter: blur(0px);
          transform: scale(1);
        }
        30% {
          filter: blur(2px);
          transform: scale(1.02);
        }
        60% {
          opacity: 0.5;
          filter: blur(4px);
          transform: scale(1.05);
        }
        100% {
          opacity: 0;
          filter: blur(8px);
          transform: scale(1.1);
        }
      }

      .dissolving {
        animation: smokeAway 2.5s ease-out forwards;
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
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