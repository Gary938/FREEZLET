// ❌ Incorrect answer effect — button freeze and shatter (Freeze & Shatter) — exactly like original
export function applyEffect(button) {
  // Ensure basic structure
  button.style.overflow = 'hidden';
  button.style.position = 'relative';
  if (button.parentElement) button.parentElement.style.overflow = 'visible';
  if (button.parentElement?.parentElement) button.parentElement.parentElement.style.overflow = 'visible';

  // Add ice cracks (before other effects)
  const crack = document.createElement('div');
  crack.className = 'ice-crack';
  crack.style.position = 'absolute';
  crack.style.inset = '0';
  crack.style.backgroundImage = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='70'><path d='M0 10 Q50 5 100 20 Q150 35 200 10' stroke='%23aef' stroke-width='1.5' fill='none'/><path d='M20 70 Q70 60 140 40 Q180 20 200 30' stroke='%23cff' stroke-width='1.2' fill='none'/></svg>\")";
  crack.style.backgroundRepeat = 'no-repeat';
  crack.style.backgroundPosition = 'center';
  crack.style.backgroundSize = 'cover';
  crack.style.opacity = '0';
  crack.style.pointerEvents = 'none';
  crack.style.zIndex = '3';
  crack.style.transition = 'opacity 0.5s ease';
  button.appendChild(crack);

  // Smooth crack appearance
  setTimeout(() => crack.style.opacity = '1', 50);

  // Add burn in advance — it spreads from bottom to top
  const burn = document.createElement('div');
  burn.className = 'burn-mark';
  burn.style.position = 'absolute';
  burn.style.inset = '0';
  burn.style.background = '#000';
  burn.style.borderRadius = 'inherit';
  burn.style.zIndex = '1';
  burn.style.opacity = '0';
  burn.style.animation = 'floodFill 1.4s ease forwards';
  button.appendChild(burn);

  // Button clone with freeze and shatter effects
  const clone = document.createElement('button');
  clone.className = 'freeze-button';
  clone.disabled = true;
  clone.textContent = button.textContent;
  clone.style.position = 'absolute';
  clone.style.top = '0';
  clone.style.left = '0';
  clone.style.width = '200px';
  clone.style.height = '70px';
  clone.style.zIndex = '2';
  clone.style.borderRadius = '10px';
  clone.style.transition = 'filter 1s ease, transform 1s ease';

  button.appendChild(clone);

  // Freeze stage
  setTimeout(() => {
    clone.classList.add('frozen');
  }, 100);

  // Shatter stage
  setTimeout(() => {
    clone.classList.add('shattered');
  }, 1000);

  // Remove clone after completion
  setTimeout(() => {
    clone.remove();
  }, 2200);

  // Add styles on first run
  if (!document.getElementById('freeze-style')) {
    const style = document.createElement('style');
    style.id = 'freeze-style';
    style.textContent = `
      .frozen {
        filter: blur(2px) brightness(1.4);
        transform: scale(1.03);
      }

      .shattered {
        animation: shatterFade 1.2s forwards;
      }

      @keyframes shatterFade {
        0% { transform: scale(1.03); opacity: 1; filter: blur(2px); }
        50% { transform: scale(1.1) rotate(2deg); opacity: 0.8; filter: blur(4px); }
        100% { transform: scale(0.3) rotate(20deg); opacity: 0; filter: blur(10px); }
      }

      @keyframes floodFill {
        0% { clip-path: circle(0% at 50% 50%); opacity: 1; }
        100% { clip-path: circle(150% at 50% 50%); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
}