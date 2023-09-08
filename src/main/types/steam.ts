export type SteamEvent = 'webSession' | 'loggedOn' | 'disconnected' | 'error' | 'accountLimitations'

export interface SteamHandler {
  event: SteamEvent
  handler: (...params: any[]) => void
}

export interface Account {
  id: number
  login: string
  password: string
  token: string
  status: string
  cb: boolean
  limited: boolean
  lvl: number
  balance: number
}
