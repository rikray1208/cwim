import { DbItem, DbItemPrice } from '../../types/db'
import Database from 'better-sqlite3'
import { dbAppPath } from '../db'

const db = new Database(dbAppPath)
const insertItems = (items: DbItem[]) => {
  try {
    const insertItem = db.prepare<DbItem>(`
        INSERT INTO item(account_id, icon_url, name, hashName, appid, tradable, marketable)
        VALUES(@account_id, @icon_url, @name, @hashName, @appid, @tradable, @marketable);
    `)

    const insertItems = db.transaction((items: DbItem[]) => {
      for (const item of items) insertItem.run(item)
    })

    insertItems(items)
  } catch (e) {
    console.log('@insert items error', e)
  }
}

const insertPrice = (itemPrice: DbItemPrice) => {
  const insertItemPrice = db.prepare<DbItemPrice>(`
      INSERT OR IGNORE INTO item_price(hashName, price)
      VALUES(@hashName, @price);
  `)

  insertItemPrice.run(itemPrice)
}

const insertItemsPrice = (itemsPrice: DbItemPrice[]) => {
  const insertItemsPrice = db.transaction((items: DbItemPrice[]) => {
    for (const item of items) insertPrice(item)
  })
  insertItemsPrice(itemsPrice)
}

const updateItem = <T extends keyof DbItem>(id: number, field: { name: T; value: DbItem[T] }) => {
  try {
    const updateItem = db.prepare(`UPDATE item SET ${field.name} = ? WHERE id = ?;`)
    updateItem.run(field.value, id)
  } catch (e) {
    console.log('@update item error', e)
  }
}

export const itemDbService = {
  insertItems,
  insertItemsPrice,
  insertPrice,
  updateItem
}
