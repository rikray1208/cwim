import { DbContext } from '../DbContext'
import { DataAttributes, SimplifiedModel } from '../types'
import { DBModel } from '../Models/DbModel'

const { AUTOINCREMENT, PRIMARY_KEY } = DataAttributes

export class DbService<M extends typeof DBModel> {
  Model: M
  private dbContext: DbContext

  constructor(Model: M, dbContext: DbContext) {
    this.Model = Model

    this.dbContext = dbContext
  }

  private insert(orIgnore?: boolean) {
    const modelKeys: string[] = []

    for (const [key, value] of Object.entries<{ attributes?: DataAttributes[] }>(
      this.Model.scheme
    )) {
      if (!value?.attributes?.includes(PRIMARY_KEY)) {
        modelKeys.push(key)
      } else if (!value?.attributes?.includes(AUTOINCREMENT)) {
        modelKeys.push(key)
      }
    }

    console.log(
      '@insert',
      `
          INSERT ${orIgnore ? 'OR IGNORE' : ''} INTO ${this.Model.name} (${modelKeys})
          VALUES (${modelKeys.map((key) => `@${key}`)});
    `
    )

    return this.dbContext.db!.prepare(`
          INSERT ${orIgnore ? 'OR IGNORE' : ''} INTO ${this.Model.name} (${modelKeys})
          VALUES (${modelKeys.map((key) => `@${key}`)});
    `)
  }

  public getAll(): SimplifiedModel<M['scheme']>[] {
    return this.dbContext.withConnection(() => {
      const items = this.dbContext.db!.prepare(`SELECT * FROM ${this.Model.name}`)
      return items.all() as SimplifiedModel<M['scheme']>[]
    })
  }

  public bulkAdd(items: SimplifiedModel<M['scheme']>[], orIgnore?: boolean) {
    this.dbContext.withConnection(() => {
      const insert = this.insert(orIgnore)

      const blobInsert = this.dbContext!.db!.transaction(
        (items: SimplifiedModel<M['scheme']>[]) => {
          for (const item of items) {
            console.log('@item', item)
            insert.run(item)
          }
        }
      )

      blobInsert(items)
    })
  }

  public add(item: SimplifiedModel<M['scheme']>, orIgnore?: boolean) {
    this.dbContext.withConnection(() => {
      const insert = this.insert(orIgnore)
      insert.run(item)
    })
  }

  public update() {}

  public delete() {}
}
