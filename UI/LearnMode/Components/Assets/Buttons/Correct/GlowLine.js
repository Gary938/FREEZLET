export function applyEffect(button) {
  button.classList.add('glowline-correct');

  // Remove effect after 1.5s
  setTimeout(() => {
    button.classList.remove('glowline-correct');
  }, 1500);

  // Add styles once
  if (!document.getElementById('glowline-style')) {
    const style = document.createElement('style');
    style.id = 'glowline-style';
    style.textContent = `
      .glowline-correct {
        background: linear-gradient(90deg, #388e3c 0%, #2e7d32 100%) !important;
        color: white !important;
        box-shadow: 0 0 18px 4px #388e3c !important;
        border: 1px solid #388e3c !important;
        position: relative;
        overflow: hidden;
        isolation: isolate;
      }

      .glowline-correct::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 6px;
        background: linear-gradient(to right, #388e3c, #a5d6a7, #388e3c);
        animation: glowLine 1.4s ease-out forwards;
        opacity: 0;
        transform-origin: left;
        pointer-events: none;
        z-index: 1;
      }

      @keyframes glowLine {
        0% { opacity: 0; transform: scaleX(0); }
        30% { opacity: 1; transform: scaleX(1.1); }
        100% { opacity: 1; transform: scaleX(1); }
      }
    `;
    document.head.appendChild(style);
  }
}