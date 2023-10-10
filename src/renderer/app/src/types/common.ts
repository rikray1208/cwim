export interface Account {
  id: number
  login: string
  password: string
  token: string | null
  proxy: string
  status: string
  cb: number
  limited: number
  lvl: number
  balance: number
}
