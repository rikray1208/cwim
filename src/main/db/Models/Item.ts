import { DataAttributes, Datatypes, TableNames } from '../types'
import { DBModel } from './DbModel'

const { NOT_NULL, PRIMARY_KEY, AUTOINCREMENT } = DataAttributes

export class MItem extends DBModel {
  static name = TableNames.ITEM

  static scheme = {
    id: {
      type: Datatypes.INTEGER,
      attributes: [PRIMARY_KEY, AUTOINCREMENT]
    },
    account_id: {
      type: Datatypes.INTEGER,
      attributes: [NOT_NULL],
      foreginKey: {
        tableName: TableNames.ACCOUNTS,
        key: 'id'
      }
    },
    icon_url: {
      type: Datatypes.TEXT
    },
    name: {
      type: Datatypes.TEXT
    },
    hashName: {
      type: Datatypes.TEXT,
      foreginKey: {
        tableName: TableNames.ITEM_PRICE,
        key: 'hashName'
      }
    },
    appid: {
      type: Datatypes.INTEGER
    },
    tradable: {
      type: Datatypes.INTEGER
    },
    marketable: {
      type: Datatypes.INTEGER
    }
  } as const

  constructor() {
    super()
  }
}
