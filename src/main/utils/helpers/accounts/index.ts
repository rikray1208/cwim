import path from 'path'
import fs from 'fs'
import { MaFileData, MaFileType } from '../../../types/accounts'
import { getAuthCode } from '../steam'

export const getMaFileData = async (login: string): Promise<MaFileData> => {
  const maFilePath = path.resolve(process.cwd(), 'maFiles', `${login}.maFile`)

  const maFile = await fs.promises.readFile(maFilePath, { encoding: 'utf8' })
  const { shared_secret, identity_secret }: MaFileType = JSON.parse(maFile)

  return { shared_secret, identity_secret }
}

export const generateAuthCode = async (login: string) => {
  const { shared_secret } = await getMaFileData(login)
  return await getAuthCode(shared_secret)
}
