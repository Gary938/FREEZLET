export function applyEffect(button) {
  button.classList.add('correct', 'wave');

  const ripple = document.createElement('span');
  ripple.className = 'wave-ripple';
  ripple.style.position = 'absolute';
  ripple.style.top = '50%';
  ripple.style.left = '50%';
  ripple.style.width = '0';
  ripple.style.height = '0';
  ripple.style.borderRadius = '50%';
  ripple.style.background = 'rgba(76, 175, 80, 0.3)';
  ripple.style.transform = 'translate(-50%, -50%)';
  ripple.style.animation = 'waveExpand 0.8s ease-out';
  ripple.style.zIndex = '-1';
  ripple.style.pointerEvents = 'none';

  const style = document.createElement('style');
  style.textContent = `
    @keyframes glowWave {
      0%   { box-shadow: 0 0 0px #4caf50; transform: scale(1); }
      50%  { box-shadow: 0 0 25px 10px #4caf50; transform: scale(1.05); }
      100% { box-shadow: 0 0 8px 4px #4caf50; transform: scale(1); }
    }

    @keyframes waveExpand {
      0%   { width: 0; height: 0; opacity: 0.6; }
      100% { width: 300px; height: 300px; opacity: 0; }
    }

    .correct.wave {
      animation: glowWave 1.6s ease-in-out forwards;
    }
  `;
  document.head.appendChild(style);

  button.appendChild(ripple);
  setTimeout(() => ripple.remove(), 800);
}
