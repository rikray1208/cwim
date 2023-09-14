import { Account } from './steam'
import { Proxy } from './global'

export type DbAccount = Omit<Account, 'id' | 'proxy'>

export interface DbProxy extends Proxy {
  account_id: number
}

export interface DbItem {
  account_id: number
  icon_url: string
  name: string
  hashName: string
  appid: number
  tradable: 1 | 0
  marketable: 1 | 0
}

export interface DbItemPrice {
  hashName: string
  price: number
}
