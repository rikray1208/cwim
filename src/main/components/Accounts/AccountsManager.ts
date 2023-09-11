import { SteamAccount } from './SteamAccount'
import { Account } from '../../types/steam'
import { delay } from '../../utils'
import { AuthMachine } from '../AuthMachine'

export class AccountsManager {
  accounts: SteamAccount[]
  queue: SteamAccount[]
  isQueueStarted: boolean

  constructor(accounts: Account[], authMachine: AuthMachine) {
    const steamAccounts = accounts.map((account) => new SteamAccount(account, authMachine))
    this.accounts = [...steamAccounts]
    this.queue = [...steamAccounts]
    this.isQueueStarted = false
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

      await delay(10000)
    }

    this.isQueueStarted = false
  }
}
