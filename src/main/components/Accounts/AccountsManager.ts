import { SteamAccount } from './SteamAccount'
import { delay } from '../../utils'
import { authMachine } from '../AuthMachine'
import { AccountService } from '../../db/Services/Account'

export class AccountsManager {
  accounts: SteamAccount[]
  queue: SteamAccount[]
  isQueueStarted: boolean

  constructor() {
    this.isQueueStarted = false
    this.accounts = []
    this.queue = []
  }

  public init() {
    const accounts = AccountService.getAll().map(
      (account) => new SteamAccount(account, authMachine)
    )
    this.accounts = [...accounts]
    this.queue = [...accounts]
  }

  public async addAccounts(account: SteamAccount) {
    this.accounts.push(account)
    this.queue.push(account)

    if (this.isQueueStarted == false) {
      await this.startQueue()
    }
  }

  public async deleteAccount(login: string) {
    const account = this.accounts.find(({ account }) => account.login === login)
    if (account) {
      if (this.isQueueStarted) {
        this.queue = this.queue.filter((account) => account.account.login !== login)
      } else {
        if (account.isLogged) account.client.logOff() // не забыть поменять
      }

      this.accounts = this.accounts.filter((account) => account.account.login !== login)
    }
  }

  public async startQueue() {
    this.isQueueStarted = true

    for (const account of this.queue) {
      await account.start()

      await delay(300)
    }

    this.isQueueStarted = false
  }
}

export const accountsManager = new AccountsManager()
