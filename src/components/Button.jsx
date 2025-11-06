import React from 'react'

function Button({
    children,
    type = 'button',
    bgColor= undefined,
    textColor = 'text-white',
    className = '',
    ...props
}) {
  const gradientStyle = !bgColor
    ? { backgroundImage: 'linear-gradient(90deg, var(--accent-start), var(--accent-mid), var(--accent-end))' }
    : undefined;
  const baseBg = bgColor ? bgColor : '';

  const handleClick = (e) => {
    if (typeof props.onClick === 'function') {
      props.onClick(e);
    }
    try {
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    } catch {}
  };
  return (
    <button
      className={`${baseBg} ${textColor} px-4 py-2 rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed ${className} relative overflow-hidden transform-gpu hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[.99]`}
      type={type}
      style={gradientStyle}
      onClick={handleClick}
      {...props}
    >
      <span className="btn-shine" aria-hidden="true" />
      {children}
    </button>
  )
}

export default Button
