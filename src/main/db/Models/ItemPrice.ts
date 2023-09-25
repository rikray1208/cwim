import { DataAttributes, Datatypes, TableNames } from '../types'
import { DBModel } from './DbModel'

const { NOT_NULL, PRIMARY_KEY } = DataAttributes

export class MItemPrice extends DBModel {
  static name = TableNames.ITEM_PRICE

  static scheme = {
    hashName: {
      type: Datatypes.TEXT,
      attributes: [PRIMARY_KEY, NOT_NULL]
    },
    price: {
      type: Datatypes.REAL
    }
  } as const

  constructor() {
    super()
  }
}
