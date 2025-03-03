import React, { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline'
}

const Button: React.FC<ButtonProps> = ({ variant = 'default', children, ...props }) => {
  return (
    <button className={`btn ${variant === 'outline' ? 'btn-outline' : ''}`} {...props}>
      {children}
    </button>
  )
}

export default Button
