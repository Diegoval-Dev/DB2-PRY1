import React, { HTMLAttributes } from 'react'

export const TableBody: React.FC<HTMLAttributes<HTMLTableSectionElement>> = ({ children, ...props }) => {
  return <tbody className="table-body" {...props}>{children}</tbody>
}
