import TradeOfferManager from 'steam-tradeoffer-manager'
import SteamCommunity from 'steamcommunity'
import SteamUser from 'steam-user'
import SteamTotp from 'steam-totp'
import { generate32BitInteger, steamInitialization } from '../../utils/helpers/steam'
import { Account, SteamHandler } from '../../types/steam'
import { EAuthTokenPlatformType, LoginSession } from 'steam-session'
import { createProxy, getMaFileData } from '../../utils/helpers/accounts'
import { accountsDbService } from '../../db/Services/accounts'
import { AUTH_MACHINE_EVENT, AuthMachine } from '../AuthMachine'

export class SteamAccount {
  account: Account
  client: SteamUser
  community: SteamCommunity
  manager: TradeOfferManager
  handlers: SteamHandler[]
  authMachine: AuthMachine

  isLogged: boolean
  shared_secret: string | null

  constructor(account: Account, authMachine: AuthMachine) {
    const options = account.proxy ? createProxy(account.proxy) : {}
    const { client, community, manager } = steamInitialization(options)

    this.account = account
    this.client = client
    this.community = community
    this.manager = manager

    this.isLogged = false
    this.shared_secret = null
    this.handlers = this.bindHandlers()
    this.authMachine = authMachine

    this.authMachine.on(AUTH_MACHINE_EVENT, this.onAuthMachine.bind(this))
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
      },
      {
        event: 'wallet',
        handler: this.walletHandler.bind(this)
      }
    ] as SteamHandler[]
  }

  private subscribeToEvents() {
    this.handlers.forEach((handler) => {
      this.client.on(handler.event, handler.handler)
    })
  }

  private walletHandler(hasWallet: boolean, currency: number, balance: number) {
    //получение баланса
    console.log('@hasWallet', hasWallet)
    console.log('@currency', currency)
    console.log('@balance', balance)
  }

  private async accountLimitationsHandler(limited: boolean, _: boolean, locked: boolean) {
    //получение лимито
    console.log(limited, locked)
  }

  private loggedOnHandler() {
    this.isLogged = true
  }

  private async disconnectedHandler() {
    this.isLogged = false
    this.client.relog()
  }
  private async webSessionHandler(_: string, cookies: string[]) {
    await this.manager.setCookies(cookies)
    this.community.setCookies(cookies)
  }

  private async generateAuthCode() {
    const { shared_secret } = await getMaFileData(this.account.login)
    return await SteamTotp.getAuthCode(shared_secret)
  }

  private async logOn() {
    if (this.account.token)
      return this.client.logOn({
        refreshToken: this.account.token,
        logonID: generate32BitInteger()
      })

    const options = this.account.proxy ? createProxy(this.account.proxy) : {}
    const session = new LoginSession(EAuthTokenPlatformType.SteamClient, options)
    const code = await this.generateAuthCode()

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

  private async onAuthMachine() {
    const code = await this.generateAuthCode()
    console.log('@code .', code)
  }
}
