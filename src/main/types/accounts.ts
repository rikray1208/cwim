export interface MaFileData {
  shared_secret: string
  identity_secret: string
}

export interface Session {
  SessionID: string
  SteamLogin: string
  SteamLoginSecure: string
  WebCookie: any
  SteamID: string
  OAuthToken: string
}

export interface MaFileType {
  shared_secret: string
  serial_number: string
  revocation_code: string
  uri: string
  server_time: string
  account_name: string
  token_gid: string
  identity_secret: string
  secret_1: string
  device_id: string
  fully_enrolled: boolean
  Session: Session
}
