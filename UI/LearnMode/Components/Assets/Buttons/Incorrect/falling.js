export function applyEffect(button) {
  const clone = button.cloneNode(true);
  const wrapper = button.parentElement;
  const wrapperRect = wrapper.getBoundingClientRect();
  const rect = button.getBoundingClientRect();

  const offsetTop = rect.top - wrapperRect.top;
  const offsetLeft = rect.left - wrapperRect.left;

  // Fix clone dimensions
  clone.style.position = 'absolute';
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.top = `${offsetTop}px`;
  clone.style.left = `${offsetLeft}px`;
  clone.style.zIndex = '10';
  clone.classList.add('falling-effect');

  // Disable original button
  button.style.visibility = 'hidden';

  wrapper.style.position = 'relative';
  wrapper.style.overflow = 'visible';
  wrapper.appendChild(clone);

  const burn = document.createElement('div');
  burn.className = 'burn-mark';
  burn.style.position = 'absolute';
  burn.style.top = `${offsetTop}px`;
  burn.style.left = `${offsetLeft}px`;
  burn.style.width = `${rect.width}px`;
  burn.style.height = `${rect.height}px`;
  burn.style.background = '#000';
  burn.style.borderRadius = '10px';
  burn.style.zIndex = '5';
  burn.style.opacity = '1';
  wrapper.appendChild(burn);

  const style = document.createElement('style');
  style.textContent = `
    @keyframes fallAway {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      20% { transform: translateY(30px) rotate(-5deg); }
      40% { transform: translateY(60px) rotate(5deg); }
      60% { transform: translateY(90px) rotate(-5deg); }
      80% { transform: translateY(120px) rotate(5deg); }
      100% { transform: translateY(150px) rotate(-10deg); opacity: 0; }
    }

    .falling-effect {
      animation: fallAway 3s ease-in forwards;
    }
  `;
  document.head.appendChild(style);

  setTimeout(() => clone.remove(), 3000);
}