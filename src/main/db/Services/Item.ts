import { DbService } from './DbService'
import { MItem } from '../Models'
import { dbContext, DbContext } from '../DbContext'

class CItemService extends DbService<typeof MItem> {
  constructor(model: typeof MItem, dbContext: DbContext) {
    super(model, dbContext)
  }
}

export const ItemService = new CItemService(MItem, dbContext)
