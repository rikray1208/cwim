import path from 'path'
import Database, { SqliteError } from 'better-sqlite3'

export const dbAppPath = path.resolve(process.cwd(), 'db.db')

export class DbManager {
  db: Database.Database

  constructor() {
    this.db = new Database(dbAppPath)
    this.db.pragma('journal_mode = WAL')
  }

  public createAccounts() {
    const createAccounts = this.db.prepare(`
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

  private createProxy() {
    const createProxy = this.db.prepare(`
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

  private createItemPrice() {
    const createItemPrice = this.db.prepare(`
       CREATE TABLE IF NOT EXISTS item_price(
            name TEXT PRIMARY KEY,
            price REAL
       )
    `)
    createItemPrice.run()
  }

  private createItem() {
    const createItem = this.db.prepare(`
        CREATE TABLE IF NOT EXISTS item(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            account_id INTEGER,
            icon_url TEXT,
            name TEXT,
            hashName TEXT,
            appid INTEGER,
            tradable INTEGER,
            marketable INTEGER,
            FOREIGN KEY (hashName) REFERENCES item_price(name)
        );
    `)
    createItem.run()
  }

  public initializeDatabase() {
    try {
      this.createAccounts()
      this.createProxy()
      this.createItemPrice()
      this.createItem()
    } catch (e) {
      const error = e as SqliteError
      console.log('@initializeDatabase error', error)
    }
  }

  public closeDb() {
    this.db.close()
  }
}
