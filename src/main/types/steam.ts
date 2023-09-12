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
