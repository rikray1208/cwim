import { db } from '../db'
import { Proxy } from '../../types/global'

const addProxy = (account_id: number, proxy: Proxy) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `
          INSERT INTO proxy (account_id, host, port, username, password)
          VALUES (?, ?, ?, ?, ?);
      `,
        [account_id, proxy.host, proxy.port, proxy.username, proxy.password],
        (err) => {
          if (err) reject(err)
          resolve(null)
        }
      )
    })
  })
}

export const proxyDbService = {
  addProxy
}
