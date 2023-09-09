import { db, sqlCreateAccounts } from '../db'
import { Account } from '../../types/steam'

const getAccounts = async (): Promise<Account[]> => {
  return new Promise((resolve) => {
    db.all(
      `SELECT accounts.*,
            proxy.host || ':' || proxy.port || ':' || proxy.username|| ':' || proxy.password AS proxy
            FROM accounts LEFT JOIN proxy ON accounts.id = proxy.account_id;`,
      (_, data: Account[]) => {
        resolve(data)
      }
    )
  })
}

const addAccounts = (accounts: Account[]) => {
  const batchSize = 999
  const batches: Account[][] = []

  for (let i = 0; i < accounts.length; i += batchSize) {
    const batchAccounts: Account[] = accounts.slice(i, i + batchSize)
    batches.push(batchAccounts)
  }

  return Promise.all<null>(
    batches.map((batch) => {
      return new Promise((resolve, reject) => {
        db.serialize(() => {
          const stmt = db.prepare(
            'INSERT INTO accounts (login, password, token, status, cb, limited, lvl, balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?);'
          )
          batch.forEach((account) => {
            stmt.run(
              account.login,
              account.password,
              account.token,
              account.status,
              account.limited,
              account.lvl,
              account.balance
            )
          })
          stmt.finalize((err) => {
            if (err) reject(err)
            resolve(null)
          })
        })
      })
    })
  )
}

const deleteAccounts = (ids: number[]) => {
  return new Promise<null>((resolve) => {
    db.serialize(() => {
      const batchSize = 999
      const batches: { sql: string; ids: number[] }[] = []

      for (let i = 0; i < ids.length; i += batchSize) {
        const batchIds: number[] = ids.slice(i, i + batchSize)
        const placeholders = batchIds.map(() => '?').join(',')
        const sql = `DELETE FROM accounts WHERE id IN (${placeholders})`
        batches.push({ sql, ids: batchIds })
      }

      batches.forEach((batch) => {
        const { sql, ids } = batch
        db.run(sql, ids)
      })

      db.run(`CREATE TEMPORARY TABLE accounts_temp AS SELECT * FROM accounts`)
      db.run('DROP TABLE accounts;')
      sqlCreateAccounts()
      db.run(`
            INSERT INTO accounts
            (login, password, token, status, cb, limited, lvl, balance)
            SELECT login, password, token, status, cb, limited, lvl, balance FROM accounts_temp;
      `)
      db.run('DROP TABLE accounts_temp;')

      resolve(null)
    })
  })
}

const setField = <T extends keyof Account>(id: number, field: { name: T; value: Account[T] }) => {
  return new Promise<null>((resolve, reject) => {
    db.serialize(() => {
      db.run(`UPDATE accounts SET ${field.name} = ? WHERE id = ?;`, [field.value, id], (err) => {
        if (err) reject(err)
        resolve(null)
      })
    })
  })
}

export const accountsDbService = {
  addAccounts,
  getAccounts,
  deleteAccounts,
  setField
}
