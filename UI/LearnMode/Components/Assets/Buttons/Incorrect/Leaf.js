// ❌ Incorrect answer effect — smooth falling with rotation (Falling Leaf)
export function applyEffect(button) {
  // Structure preparation
  button.style.overflow = 'hidden';
  button.style.position = 'relative';
  if (button.parentElement) button.parentElement.style.overflow = 'visible';
  if (button.parentElement?.parentElement) button.parentElement.parentElement.style.overflow = 'visible';

  // Add burn in advance — fixed
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

  // Clone button and prepare for animation
  const clone = document.createElement('button');
  clone.className = 'fall-button falling';
  clone.disabled = true;
  clone.textContent = button.textContent;
  clone.style.position = 'absolute';
  clone.style.inset = '0';
  clone.style.borderRadius = 'inherit';
  clone.style.zIndex = '1';

  // Random rotation and duration parameters
  const duration = (Math.random() * 1 + 2.5).toFixed(2) + 's';
  const angles = [0, 1, 2, 3, 4].map(() => (Math.random() * 20 - 10).toFixed(1) + 'deg');
  clone.style.setProperty('--duration', duration);
  clone.style.setProperty('--r1', angles[0]);
  clone.style.setProperty('--r2', angles[1]);
  clone.style.setProperty('--r3', angles[2]);
  clone.style.setProperty('--r4', angles[3]);
  clone.style.setProperty('--r5', angles[4]);

  button.appendChild(clone);

  setTimeout(() => clone.remove(), parseFloat(duration) * 1000);

  // Add styles if not already added
  if (!document.getElementById('fall-style')) {
    const style = document.createElement('style');
    style.id = 'fall-style';
    style.textContent = `
      .falling {
        animation: fallAway var(--duration, 3s) ease-in forwards;
      }

      @keyframes fallAway {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        20% {
          transform: translateY(30px) rotate(var(--r1, -5deg));
        }
        40% {
          transform: translateY(60px) rotate(var(--r2, 5deg));
        }
        60% {
          transform: translateY(90px) rotate(var(--r3, -5deg));
        }
        80% {
          transform: translateY(120px) rotate(var(--r4, 5deg));
        }
        100% {
          transform: translateY(150px) rotate(var(--r5, -10deg));
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