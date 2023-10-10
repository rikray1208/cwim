export type Proxy = { host: string; port: string; username: string; password: string }

export type Skin = {
  id: number
  account_id: number
  icon_url: string
  name: string
  hashName: string
  appid: number
  tradable: number
  marketable: number
  price: number
}

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
