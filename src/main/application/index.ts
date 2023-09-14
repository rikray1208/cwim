import { app as electronApp, App } from 'electron'
import { WindowsManger } from './WindowsManger'
import { accountsDbService } from '../db/Services/accounts'
import { AuthMachine } from '../components/AuthMachine'
import { AccountsManager } from '../components/Accounts/AccountsManager'
import { SkinsManager } from '../components/SkinsManager'
import { DbManager } from '../db/db'

class Application {
  app: App
  windowsManager: WindowsManger
  constructor() {
    this.app = electronApp
    this.windowsManager = new WindowsManger()

    this.app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        electronApp.quit()
        process.exit(1)
      }
    })
  }
}

export const application = new Application()
export const dbManager = new DbManager()

application.app.whenReady().then(async () => {
  await application.windowsManager.createMainWindow()
  dbManager.initializeDatabase()
  const authMachine = new AuthMachine(1)
  authMachine.start()

  const accounts = accountsDbService.getAccounts()
  const manager = new AccountsManager(accounts, authMachine)
  const skinsManager = new SkinsManager(manager.accounts)

  //proxyDbService.addProxy({account_id: 3, host: '185.199.229.156', port: '7492', username: 'raun1234', password: 'raun1234'})
  await manager.startQueue()
  await skinsManager.parseSkins()
})
