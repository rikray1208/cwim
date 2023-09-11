import path from 'path'
import fs from 'fs'
import { MaFileData, MaFileType } from '../../../types/accounts'

export const getMaFileData = async (login: string): Promise<MaFileData> => {
  const maFilePath = path.resolve(process.cwd(), 'maFiles', `${login}.maFile`)

  const maFile = await fs.promises.readFile(maFilePath, { encoding: 'utf8' })
  const { shared_secret, identity_secret }: MaFileType = JSON.parse(maFile)

  return { shared_secret, identity_secret }
}

export const splitProxy = (proxy: string) => {
  const [host, port, username, password] = proxy.split(':')
  return { host, port, username, password }
}

export const createProxy = (proxy: string) => {
  const { host, port, username, password } = splitProxy(proxy)
  return {
    httpProxy: `http://${username}:${password}@${host}:${port}`
  }
}
