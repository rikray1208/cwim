import Database from 'better-sqlite3'
import path from 'path'
import { DBModel } from './Models/DbModel'
import { MAccount, MItem, MItemPrice } from './Models'

export const dbAppPath = path.resolve(process.cwd(), 'db.db')
export class DbContext {
  db: Database.Database | null
  Models = [MAccount, MItemPrice, MItem]
  constructor() {
    this.db = null
  }

  private openDB() {
    this.db = new Database(dbAppPath)
    this.db.pragma('journal_mode = WAL')
  }
  private closeDB() {
    this.db?.close()
  }
  private crateTable(Model: typeof DBModel) {
    const rows = Model.generateSqlRoutes()

    const create = this.db!.prepare(`
        CREATE TABLE IF NOT EXISTS ${Model.name} (${rows})
    `)

    create.run()
  }
  public init() {
    const request = () => {
      for (const Model of this.Models) this.crateTable(Model)
    }

    this.withConnection(request)
  }
  public withConnection<T>(request: () => T): T {
    this.openDB()
    if (!this.db) throw new Error('!this.db')

    const response = request()
    this.closeDB()
    return response
  }
}
export const dbContext = new DbContext()
