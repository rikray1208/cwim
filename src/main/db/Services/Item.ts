import { DbService } from './DbService'
import { MItem } from '../Models'
import { dbContext, DbContext } from '../DbContext'
import { SimplifiedModel, TableNames } from '../types'

class CItemService extends DbService<typeof MItem> {
  constructor(model: typeof MItem, dbContext: DbContext) {
    super(model, dbContext)
  }

  public getAllWithPrice() {
    return this.dbContext.withConnection(() => {
      const tableName = this.Model.name

      const select = this.dbContext.db!.prepare(`
        SELECT ${tableName}.*, ${TableNames.ITEM_PRICE} FROM ${tableName}
        INNER JOIN ${TableNames.ITEM_PRICE} ON ${tableName}.hashName = ${TableNames.ITEM_PRICE}.hashName
      `)

      return select.all() as (SimplifiedModel<(typeof MItem)['scheme']> & { price: number })[]
    })
  }

  public getAllGroupByName() {
    return this.dbContext.withConnection(() => {
      const tableName = this.Model.name

      const select = this.dbContext.db!.prepare(`SELECT * FROM ${tableName} GROUP BY hashName`)

      return select.all() as SimplifiedModel<(typeof MItem)['scheme']>[]
    })
  }
}

export const ItemService = new CItemService(MItem, dbContext)
