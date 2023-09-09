import TradeOfferManager from 'steam-tradeoffer-manager'
import SteamCommunity from 'steamcommunity'
import SteamUser from 'steam-user'
import { generate32BitInteger, steamInitialization } from '../../utils/helpers/steam'
import { Account, SteamHandler } from '../../types/steam'
import { EAuthTokenPlatformType, LoginSession } from 'steam-session'
import { createProxy, generateAuthCode } from '../../utils/helpers/accounts'
import { accountsDbService } from '../../db/Services/accounts'

export class SteamAccount {
  account: Account
  client: SteamUser
  community: SteamCommunity
  manager: TradeOfferManager
  handlers: SteamHandler[]

  isLogged: boolean
  shared_secret: string | null

  constructor(account: Account) {
    const options = account.proxy ? createProxy(account.proxy) : {}
    const { client, community, manager } = steamInitialization(options)

    this.account = account
    this.client = client
    this.community = community
    this.manager = manager

    this.isLogged = false
    this.shared_secret = null
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
        event: 'accountLimitations',
        handler: this.accountLimitationsHandler.bind(this)
      }
    ] as SteamHandler[]
  }

  private loggedOnHandler() {
    this.isLogged = true
  }

  private async webSessionHandler(_: string, cookies: string[]) {
    console.log(this.client.wallet)
    await this.manager.setCookies(cookies)
    this.community.setCookies(cookies)
  }

  private async disconnectedHandler() {
    this.isLogged = false
    this.client.relog()
  }

  private async accountLimitationsHandler(limited: boolean, _: boolean, locked: boolean) {
    console.log(limited, locked)
  }
  private subscribeToEvents() {
    this.handlers.forEach((handler) => {
      this.client.on(handler.event, handler.handler)
    })
  }

  private async logOn() {
    if (this.account.token)
      return this.client.logOn({
        refreshToken: this.account.token,
        logonID: generate32BitInteger()
      })

    const options = this.account.proxy ? createProxy(this.account.proxy) : {}
    const session = new LoginSession(EAuthTokenPlatformType.SteamClient, options)
    const code = await generateAuthCode(this.account.login)

    await session.startWithCredentials({
      accountName: this.account.login,
      password: this.account.password,
      steamGuardCode: code
    })

    const token = await new Promise<string>((resolve, reject) => {
      session.on('authenticated', () => resolve(session.refreshToken))
      setTimeout(() => reject(new Error('Bad auth')), 60000)
    })

    session.cancelLoginAttempt()
    await accountsDbService.setField<'token'>(this.account.id, { name: 'token', value: token })

    this.client.logOn({
      refreshToken: token,
      logonID: generate32BitInteger()
    })
  }

  public async start() {
    this.subscribeToEvents()
    await this.logOn()

    await new Promise((resolve, reject) => {
      this.client.on('loggedOn', () => resolve(null))
      this.client.on('error', (error) => reject(error))
    })
  }
}
