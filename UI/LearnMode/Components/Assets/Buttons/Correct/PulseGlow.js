// ✅ Float effect for correct answer (in #388e3c color)
export function applyEffect(button) {
  button.style.overflow = 'visible';
  if (button.parentElement) button.parentElement.style.overflow = 'visible';
  if (button.parentElement?.parentElement) button.parentElement.parentElement.style.overflow = 'visible';

  button.style.position = 'relative';
  button.style.backgroundColor = '#388e3c';
  button.style.color = 'white';
  button.style.border = '1px solid #388e3c';
  button.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
  button.style.transform = 'translateY(-6px)';

  if (!document.getElementById('float-style')) {
    const style = document.createElement('style');
    style.id = 'float-style';
    style.textContent = `
      @keyframes floatPulse {
        0%   { box-shadow: 0 0 0px 0px transparent; }
        30%  { box-shadow: 0 0 16px 8px #388e3c; }
        60%  { box-shadow: 0 0 32px 16px #66bb6a; }
        100% { box-shadow: 0 0 0px 0px transparent; }
      }
    `;
    document.head.appendChild(style);
  }

  button.style.animation = 'floatPulse 3s ease-in-out';

  setTimeout(() => {
    button.style.boxShadow = '';
    button.style.transform = '';
    button.style.animation = '';
    button.style.backgroundColor = '';
    button.style.color = '';
  }, 3000);
}
