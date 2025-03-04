import React, { HTMLAttributes } from 'react'

export const TableHeader: React.FC<HTMLAttributes<HTMLTableSectionElement>> = ({ children, ...props }) => {
  return <thead className="table-header" {...props}>{children}</thead>
}
