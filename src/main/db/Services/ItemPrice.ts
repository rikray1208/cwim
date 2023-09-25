import { DbService } from './DbService'
import { dbContext, DbContext } from '../DbContext'
import { MItemPrice } from '../Models'

class CItemPriceService extends DbService<typeof MItemPrice> {
  constructor(model: typeof MItemPrice, dbContext: DbContext) {
    super(model, dbContext)
  }
}

export const ItemPriceService = new CItemPriceService(MItemPrice, dbContext)
