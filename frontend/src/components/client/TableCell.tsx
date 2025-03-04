import React, { HTMLAttributes } from 'react'

interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  header?: boolean
  align?: 'left' | 'center' | 'right'
  colSpan?: number
}

export const TableCell: React.FC<TableCellProps> = ({ header, align = 'left', children, ...props }) => {
  const Tag = header ? 'th' : 'td'
  return (
    <Tag className={`table-cell align-${align}`} {...props}>
      {children}
    </Tag>
  )
}
