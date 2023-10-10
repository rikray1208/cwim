import React from 'react'
import styles from './styles.module.scss'
import TableItem from './TableItem'
import { TableAction, TableColumn, TableRow } from '../types'

export interface TableProps {
  columns: TableColumn[]
  rows: TableRow[]
  actions?: TableAction[]

  isLoading?: boolean
}

const Table: React.FC<TableProps> = ({ columns, actions, rows }) => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.title}</th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {rows.map((row) => (
            <TableItem key={row.id} row={row} actions={actions} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
