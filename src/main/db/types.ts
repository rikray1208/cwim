import { DBModel } from './Models/DbModel'

export enum TableNames {
  ACCOUNTS = 'accounts',
  PROXY = 'proxy',
  ITEM = 'items',
  ITEM_PRICE = 'items_price'
}

export enum Datatypes {
  NULL = 'NULL',
  INTEGER = 'INTEGER',
  REAL = 'REAL',
  TEXT = 'TEXT',
  BLOB = 'BLOB'
}

export enum DataAttributes {
  NOT_NULL = 'NOT NULL',
  PRIMARY_KEY = 'PRIMARY KEY',
  AUTOINCREMENT = 'AUTOINCREMENT',
  UNIQUE = 'UNIQUE'
}

export type ModelSchemeItem = {
  type: Datatypes
  default?: any
  attributes?: Readonly<DataAttributes[]>
  foreginKey?: {
    tableName: TableNames
    key: string
  }
}

export type ModelScheme = {
  [key: string]: ModelSchemeItem
}

export type SimplifiedModel<T> = {
  [Key in keyof T]: T[Key] extends { type: Datatypes.TEXT } ? string : number
}

export type SimplifiedPKey<T extends typeof DBModel> =
  T['primaryKey']['type'] extends Datatypes.TEXT ? string : number

// export type SimplifiedModelScheme<T extends ModelScheme> = {
//   [K in keyof T]: T[K]['type'] extends  Datatypes.TEXT ? string : number;
// };

// export type ModelSchemeItem<T extends TableModel, K extends keyof T> = {
//   type: T[K];
//   default?: T[K] extends Datatypes.TEXT ? string : T[K] extends Datatypes.INTEGER | Datatypes.REAL ? number : null;
//   attributes?: DataAttributes[]
//   foreginKey?: {
//     tableName: TableNames,
//     key: string
//   }
// }
//
// export type ModelScheme<T extends TableModel> = {
//   [key in keyof T]: ModelSchemeItem<T, key>
// }

//Unparse types
// export type UnparseModel<T extends TableModel> = {
//   [key in keyof T]:
//     T[key] extends Datatypes.TEXT
//       ? string : T[key] extends Datatypes.INTEGER | Datatypes.REAL
//         ? number : null

// export interface DbProxy extends Proxy {
//   account_id: number
// }
//
// export interface MItem {
//   account_id: number
//   icon_url: string
//   name: string
//   hashName: string
//   appid: number
//   tradable: 1 | 0
//   marketable: 1 | 0
// }
//
// export interface MItemPrice {
//   hashName: Datatypes.TEXT
//   price: Datatypes.REAL
// }
