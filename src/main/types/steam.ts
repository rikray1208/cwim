export type SteamEvent =
  | 'webSession'
  | 'loggedOn'
  | 'disconnected'
  | 'error'
  | 'accountLimitations'
  | 'wallet'

export interface SteamHandler {
  event: SteamEvent
  handler: (...params: any[]) => void
}

export interface Account {
  id: number
  login: string
  password: string
  token: string | null
  proxy: string | null
  status: string
  cb: 0 | 1
  limited: 0 | 1
  lvl: number
  balance: number
}

export type SteamInventory = { appid: number; contextid: number }

export interface tag {
  internal_name: string
  name: string
  category: string
  color: string
  category_name: string
}

export interface EconItem {
  currencyid: any
  is_currency: boolean
  owner: any
  market_fee_app: number
  cache_expiration?: Date
  actions: any[]
  id: string
  assetid: number | string
  contextid: number
  appid: number
  classid: number
  instanceid: number
  amount: number
  pos?: number
  name: string
  market_hash_name: string
  name_color: string
  background_color: string
  type: string
  tradable: boolean
  marketable: boolean
  commodity: boolean
  market_tradable_restriction: number
  market_marketable_restriction: number
  descriptions: any[]
  fraudwarnings: any[]
  tags: tag[]
  app_data?: any

  getImageURL(): string
  getLargeImageURL(): string
  getTag(category: string): tag | null
}
