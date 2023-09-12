import path from 'path'
import Database, { SqliteError } from 'better-sqlite3'

export const dbAppPath = path.resolve(process.cwd(), 'db.db')

const db = new Database(dbAppPath)
db.pragma('journal_mode = WAL')
// export const db = new sqlite3.Database(dbAppPath, (error) => {
//   if (error) console.log('@db error', error)
// })

export const sqlCreateAccounts = () => {
  const createAccounts = db.prepare(`
      CREATE TABLE IF NOT EXISTS accounts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          login TEXT NOT NULL,
          password TEXT NOT NULL,
          token TEXT,
          status TEXT,
          lvl INTEGER NOT NULL DEFAULT 0,
          balance INTEGER NOT NULL DEFAULT 0,
          limited INTEGER NOT NULL DEFAULT 0,
          cb INTEGER NOT NULL DEFAULT 0
      );
  `)
  createAccounts.run()
}

const sqlCreateProxy = () => {
  const createProxy = db.prepare(`
       CREATE TABLE IF NOT EXISTS proxy (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           account_id INTEGER,
           host TEXT NOT NULL,
           port TEXT NOT NULL,
           username TEXT NOT NULL,
           password TEXT NOT NULL,
           FOREIGN KEY (account_id) REFERENCES accounts(id)
       );
  `)
  createProxy.run()
}

export const initializeDatabase = () => {
  try {
    sqlCreateAccounts()
    sqlCreateProxy()
  } catch (e) {
    const error = e as SqliteError
    console.log('@initializeDatabase', error)
  }
}

export const closeDb = () => {
  db.close()
}
