import React, { HTMLAttributes } from 'react'

export const TableRow: React.FC<HTMLAttributes<HTMLTableRowElement>> = ({ children, ...props }) => {
  return <tr className="table-row" {...props}>{children}</tr>
}
