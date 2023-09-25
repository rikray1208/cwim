import { DataAttributes, Datatypes, TableNames } from '../types'
import { DBModel } from './DbModel'

const { NOT_NULL, PRIMARY_KEY } = DataAttributes

export class MAccount extends DBModel {
  static name = TableNames.ACCOUNTS

  static scheme = {
    id: {
      type: Datatypes.INTEGER,
      attributes: [NOT_NULL, PRIMARY_KEY]
    },
    login: {
      type: Datatypes.TEXT,
      attributes: [NOT_NULL]
    },
    password: {
      type: Datatypes.TEXT,
      attributes: [NOT_NULL]
    },
    token: {
      type: Datatypes.TEXT
    },
    status: {
      type: Datatypes.TEXT
    },
    proxy: {
      type: Datatypes.TEXT
    },
    balance: {
      type: Datatypes.REAL,
      default: 0
    },
    lvl: {
      type: Datatypes.INTEGER,
      default: 0
    },
    limited: {
      type: Datatypes.INTEGER,
      default: 0
    },
    cb: {
      type: Datatypes.INTEGER,
      default: 0
    }
  } as const

  constructor() {
    super()
  }
}
