import { dbAppPath, sqlCreateAccounts } from '../db'
import { Account } from '../../types/steam'
import Database from 'better-sqlite3'
import { DbAccount } from '../../types/db'

const db = new Database(dbAppPath)

const getAccounts = (): Account[] => {
  const selectAccounts = db.prepare(
    `SELECT accounts.*,
            proxy.host || ':' || proxy.port || ':' || proxy.username|| ':' || proxy.password AS proxy
            FROM accounts LEFT JOIN proxy ON accounts.id = proxy.account_id;`
  )
  return selectAccounts.all() as Account[]
}

const addAccounts = (accounts: DbAccount[]) => {
  try {
    const insertAccount = db.prepare<DbAccount>(`
        INSERT INTO accounts (login, password, token, status, cb, limited, lvl, balance)
        VALUES (@login, @password, @token, @status, @cb, @limited, @lvl, @balance);
   `)

    const insertAccounts = db.transaction((accounts: DbAccount[]) => {
      for (const account of accounts) insertAccount.run(account)
    })

    insertAccounts(accounts)
  } catch (e) {
    console.log('@add accs error', e)
  }
}

const deleteAccounts = (ids: number[]) => {
  try {
    const deleteAccount = db.prepare<number>(`DELETE FROM accounts WHERE id = ?`)
    const deleteAccounts = db.transaction((ids: number[]) => {
      for (const id of ids) deleteAccount.run(id)
    })

    deleteAccounts(ids)

    db.prepare(`CREATE TEMPORARY TABLE accounts_temp AS SELECT * FROM accounts`).run()
    db.prepare('DROP TABLE accounts;').run()
    sqlCreateAccounts()
    db.prepare(
      `
            INSERT INTO accounts
            (login, password, token, status, cb, limited, lvl, balance)
            SELECT login, password, token, status, cb, limited, lvl, balance FROM accounts_temp;
      `
    ).run()
    db.prepare('DROP TABLE accounts_temp;').run()
  } catch (e) {
    console.log('@deleteAccounts error', e)
  }
}

const updateAccount = <T extends keyof Account>(
  id: number,
  field: { name: T; value: Account[T] }
) => {
  try {
    const updateAccount = db.prepare(`UPDATE accounts SET ${field.name} = ? WHERE id = ?;`)
    updateAccount.run(field.value, id)
  } catch (e) {
    console.log('@setFild error', e)
  }
}

export const accountsDbService = {
  addAccounts,
  getAccounts,
  deleteAccounts,
  updateAccount
}
