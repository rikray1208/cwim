import path from 'path'
import sqlite3 from 'sqlite3'

const dbAppPath = path.resolve(process.cwd(), 'db.db')

export const db = new sqlite3.Database(dbAppPath, (error) => {
  if (error) console.log('@db error', error)
})

db.get('PRAGMA foreign_keys = ON;', (error) => {
  if (error) console.log('@db error', error)
})

export const sqlCreateAccounts = () => {
  db.run(`
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
}

export const initializeDatabase = () => {
  db.serialize(() => {
    sqlCreateAccounts()
  })
}

db.on('error', (error) => {
  console.error('Database error:', error.message)
})

export const closeDb = () => {
  db.close()
}
