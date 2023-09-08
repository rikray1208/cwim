import TradeOfferManager from 'steam-tradeoffer-manager'
import SteamCommunity from 'steamcommunity'
import SteamUser from 'steam-user'
import { steamInitialization } from '../../utils/helpers/steam'
import { Account, SteamHandler } from '../../types/steam'

export class SteamAccount {
  account: Account
  client: SteamUser
  community: SteamCommunity
  manager: TradeOfferManager
  handlers: SteamHandler[]

  constructor(account: Account) {
    const { client, community, manager } = steamInitialization()
    this.account = account
    this.client = client
    this.community = community
    this.manager = manager

    this.handlers = this.bindHandlers()
  }

  private bindHandlers() {
    return [
      {
        event: 'loggedOn',
        handler: this.loggedOnHandler.bind(this)
      },
      {
        event: 'webSession',
        handler: this.webSessionHandler.bind(this)
      },
      {
        event: 'disconnected',
        handler: this.disconnectedHandler.bind(this)
      },
      {
        event: 'error',
        handler: this.onErrorHandler.bind(this)
      },
      {
        event: 'accountLimitations',
        handler: this.accountLimitationsHandler.bind(this)
      }
    ] as SteamHandler[]
  }
  private async loggedOnHandler() {
    console.log('logged on')
  }
  private async webSessionHandler() {}
  private async disconnectedHandler() {}
  private async onErrorHandler(error: Error) {
    console.log('@error', error)
  }
  private async accountLimitationsHandler() {}
}
