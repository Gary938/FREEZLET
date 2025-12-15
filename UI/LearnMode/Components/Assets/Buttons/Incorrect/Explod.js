export function applyEffect(button) {
  // Button stays in place, effect added inside
  button.style.position = 'relative';
  button.style.overflow = 'hidden';

  const wrapper = document.createElement('div');
  wrapper.className = 'button-wrapper';
  wrapper.style.position = 'absolute';
  wrapper.style.top = 0;
  wrapper.style.left = 0;
  wrapper.style.width = '100%';
  wrapper.style.height = '100%';
  wrapper.style.overflow = 'visible';
  wrapper.style.borderRadius = 'inherit';
  wrapper.style.pointerEvents = 'none';
  button.appendChild(wrapper);

  const left = document.createElement('div');
  left.className = 'button-half left-half';
  left.textContent = 'Incorrect';

  const right = document.createElement('div');
  right.className = 'button-half right-half';
  right.textContent = 'Answer';

  wrapper.appendChild(left);
  wrapper.appendChild(right);

  setTimeout(() => {
    left.classList.add('split-left');
    right.classList.add('split-right');
  }, 20);

  const flash = document.createElement('div');
  flash.className = 'flash active';
  wrapper.appendChild(flash);
  setTimeout(() => flash.remove(), 420);

  const colors = ['orange', 'red', 'gold', 'yellow', '#ff6600'];
  for (let i = 0; i < 15; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const dx = (Math.random() - 0.5) * 120 + 'px';
    const dy = (Math.random() - 0.5) * 120 + 'px';
    const size = Math.random() > 0.5 ? '4px' : '6px';
    const round = Math.random() > 0.3 ? '50%' : '1px';
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.setProperty('--dx', dx);
    p.style.setProperty('--dy', dy);
    p.style.left = '50%';
    p.style.top = '50%';
    p.style.background = color;
    p.style.boxShadow = `0 0 8px 2px ${color}`;
    p.style.width = size;
    p.style.height = size;
    p.style.borderRadius = round;
    p.style.position = 'absolute';
    wrapper.appendChild(p);
    setTimeout(() => p.remove(), 840);
  }

  const mark = document.createElement('div');
  mark.className = 'burn-mark';
  mark.style.position = 'absolute';
  mark.style.inset = '0';
  mark.style.background = '#000';
  mark.style.borderRadius = 'inherit';
  mark.style.zIndex = '0';
  mark.style.opacity = '0';
  mark.style.animation = 'floodFill 1.96s ease forwards';
  mark.style.pointerEvents = 'none';
  wrapper.appendChild(mark);

  if (!document.getElementById('explode-style')) {
    const style = document.createElement('style');
    style.id = 'explode-style';
    style.textContent = `
      .button-half {
        position: absolute;
        height: 100%;
        width: 50%;
        background: #2a2a3b;
        color: white;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        transition: transform 0.84s ease, opacity 0.84s ease;
        overflow: hidden;
      }

      .left-half {
        left: 0;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
      }

      .right-half {
        right: 0;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
      }

      .split-left {
        transform: rotateY(-70deg) translateX(-40px);
        opacity: 0;
      }

      .split-right {
        transform: rotateY(70deg) translateX(40px);
        opacity: 0;
      }

      .flash {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        opacity: 0;
        pointer-events: none;
        z-index: 5;
      }

      .flash.active {
        animation: flashOut 0.42s ease-out;
      }

      @keyframes flashOut {
        from { opacity: 0.9; }
        to { opacity: 0; }
      }

      .particle {
        position: absolute;
        width: 6px;
        height: 6px;
        background: orange;
        border-radius: 50%;
        animation: particleFly 840ms ease-out forwards;
        pointer-events: none;
        box-shadow: 0 0 8px 2px orange;
      }

      @keyframes particleFly {
        0% { transform: translate(0, 0) scale(1); opacity: 1; }
        100% {
          transform: translate(var(--dx), var(--dy)) scale(0.3);
          opacity: 0;
        }
      }

      .burn-mark {
        position: absolute;
        inset: 0;
        background: #000;
        border-radius: inherit;
        z-index: 0;
        opacity: 0;
        animation: floodFill 1.96s ease forwards;
        pointer-events: none;
        overflow: hidden;
      }

      @keyframes floodFill {
        0% { clip-path: circle(0% at 50% 50%); opacity: 1; }
        100% { clip-path: circle(150% at 50% 50%); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
}