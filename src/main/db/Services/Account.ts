import { DbService } from './DbService'
import { MAccount } from '../Models'
import { dbContext, DbContext } from '../DbContext'

class CAccountService extends DbService<typeof MAccount> {
  constructor(model: typeof MAccount, dbContext: DbContext) {
    super(model, dbContext)
  }
}

export const AccountService = new CAccountService(MAccount, dbContext)
