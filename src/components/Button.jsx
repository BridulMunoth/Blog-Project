import React from 'react'

function Button({
    children,
    type = 'button',
    bgColor= 'bg-blue-500',
    textColor = 'text-white',
    className = '',
    ...props
}) {
  return (
    <button className={`${bgColor} ${textColor} px-4 py-2 ${className}`} type={type} {...props}>
      {children}
    </button>
  )
}

export default Button

