import React from 'react'

import { LucideIcon } from '../ui'
import styles from './styles.module.scss'
import { COLOR_PALETTE } from '../../utils/constants'
import { TableAction, TableRow } from '../types'

const { SUCCESS, ERROR } = COLOR_PALETTE

interface TableItemProps {
  row: TableRow
  actions?: TableAction[]
}

const TableItem: React.FC<TableItemProps> = ({ row, actions }) => {
  return (
    <tr>
      {Object.entries(row).map(([key, item]) => {
        if (typeof item == 'number' || typeof item == 'string') {
          return <td key={key}>{item}</td>
        }

        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          return (
            <td key={key}>
              <div className={styles.tableItemFlex}>
                {item?.image && (
                  <img src={item.image} alt="image" width={32} className={styles.tableIcon} />
                )}
                {item.value}
                {item?.icon && <LucideIcon name={item.icon} color={item?.iconColor} />}
              </div>
            </td>
          )
        }

        if (typeof item == 'boolean') {
          return (
            <td key={key}>
              <LucideIcon name={item ? 'CheckCircle2' : 'XCircle'} color={item ? SUCCESS : ERROR} />
            </td>
          )
        }

        return <td key={key}>{key}</td>
      })}
      {actions?.length && (
        <td>
          <div className={styles.actionsContainer}>
            {actions.map((action) => (
              <button
                key={action.key}
                onClick={() => action.handler(row.id)}
                className={styles.actionBtn}
              >
                <LucideIcon name={action.btnName} />
              </button>
            ))}
          </div>
        </td>
      )}
    </tr>
  )
}

export default TableItem
