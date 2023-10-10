import React, { useEffect, useState } from 'react'
import styles from './style.module.scss'
import { Table } from '../../components'
import { TableAction, TableColumn, TableRow } from '../../components/types'
import { Account } from '../../types/common'
import { numberToBool } from '../../utils/helpers/numberToBool'

const columns: TableColumn[] = [
  { key: 1, title: 'id' },
  { key: 2, title: 'account' },
  { key: 3, title: 'guard' },
  { key: 4, title: 'tp' },
  { key: 5, title: 'kt' },
  { key: 6, title: 'lvl' },
  { key: 7, title: 'balance' }
]

const actions: TableAction[] = [
  { key: 1, btnName: 'Copy', handler: () => 1 },
  { key: 2, btnName: 'Lock', handler: () => 1 },
  { key: 3, btnName: 'Trash', handler: () => 1 }
]
const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([])

  const rows: TableRow[] = accounts.map((account) => ({
    id: account.id,
    login: {
      value: account.login,
      image: 'https://avatars.steamstatic.com/508683eea7a031afdb0a3ee96c1bfe47000b087e_medium.jpg'
    },
    guard: { value: 'MW8GG', icon: 'Copy' },
    tp: !numberToBool(account.cb),
    kt: !numberToBool(account.lvl),
    lvl: account.lvl,
    balance: {
      value: account.balance,
      icon: 'DollarSign',
      iconColor: '#A3BE8C'
    }
  }))

  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await window.accountsApi.getAccounts()
      setAccounts(accounts)
    }

    getAccounts()
  }, [])

  return (
    <div className={styles.container}>
      <Table columns={columns} rows={rows} actions={actions} />
    </div>
  )
}

export default Accounts
