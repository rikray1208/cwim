import Database from 'better-sqlite3'
import { dbAppPath } from '../db'
import { AddProxy } from '../../types/db'

const db = new Database(dbAppPath)

const addProxy = (addProxyObj: AddProxy) => {
  try {
    const insertProxy = db.prepare<AddProxy>(`
          INSERT INTO proxy (account_id, host, port, username, password)
          VALUES (@account_id, @host, @port, @username, @password);
    `)
    insertProxy.run(addProxyObj)
  } catch (e) {
    console.log('@add proxy error', e)
  }
}

export const proxyDbService = {
  addProxy
}
