import { SteamAccount } from './Accounts/SteamAccount'

export class TradeOfferManager {
  from: SteamAccount | null
  to: SteamAccount | null
  offer: any

  constructor() {
    this.from = null
    this.to = null
  }

  public setFrom(account: SteamAccount) {
    this.from = account
  }

  public setTo(account: SteamAccount) {
    this.to = account
  }

  public createOffer() {
    if (this.from !== null && this.to !== null) {
      this.offer = this.from.manager.createOffer(this.to.client.steamID)
    }
  }
}
