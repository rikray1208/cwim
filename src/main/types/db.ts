import { Account } from './steam'
import { Proxy } from './global'

export type DbAccount = Omit<Account, 'id' | 'proxy'>
export interface AddProxy extends Proxy {
  account_id: number
}
