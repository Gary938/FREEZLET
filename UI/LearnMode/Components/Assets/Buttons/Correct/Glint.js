export function applyEffect(button) {
  // Ensure styles apply only to specific button
  button.classList.add('glint-correct');

  // Remove class after animation ends (1.2s)
  setTimeout(() => {
    button.classList.remove('glint-correct');
  }, 1300);

  // Add styles if not already added
  if (!document.getElementById('glint-style')) {
    const style = document.createElement('style');
    style.id = 'glint-style';
    style.textContent = `
      .glint-correct {
        background: linear-gradient(90deg, #388e3c 0%, #2e7d32 100%) !important;
        color: white !important;
        box-shadow: 0 0 14px 4px #388e3c !important;
        border: 1px solid #388e3c !important;
        position: relative;
        overflow: hidden;
        isolation: isolate;
      }

      .glint-correct::before {
        content: '';
        position: absolute;
        top: 0;
        left: -75%;
        width: 50%;
        height: 100%;
        background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
        transform: skewX(-20deg);
        animation: glintMove 1.2s ease-in-out forwards;
        pointer-events: none;
        z-index: 1;
      }

      @keyframes glintMove {
        0% { left: -75%; }
        100% { left: 125%; }
      }
    `;
    document.head.appendChild(style);
  }
}