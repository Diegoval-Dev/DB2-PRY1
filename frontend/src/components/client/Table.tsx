import React, { HTMLAttributes } from 'react'

export const Table: React.FC<HTMLAttributes<HTMLTableElement>> = ({ children, ...props }) => {
  return <table className="table" {...props}>{children}</table>
}
