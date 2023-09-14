import Database from 'better-sqlite3'
import { dbAppPath } from '../db'
import { DbProxy } from '../../types/db'

const db = new Database(dbAppPath)

const addProxy = (addProxyObj: DbProxy) => {
  try {
    const insertProxy = db.prepare<DbProxy>(`
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
