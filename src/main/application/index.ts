import { app as electronApp, App } from 'electron'
import { WindowsManger } from './WindowsManger'
import { initializeDatabase } from '../db/db'
import { accountsDbService } from '../db/Services/accounts'
import { AuthMachine } from '../components/AuthMachine'
import { AccountsManager } from '../components/Accounts/AccountsManager'

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

application.app.whenReady().then(async () => {
  await application.windowsManager.createMainWindow()
  initializeDatabase()

  const authMachine = new AuthMachine(1)
  authMachine.start()

  const accounts = accountsDbService.getAccounts()

  const manager = new AccountsManager(accounts, authMachine)

  //proxyDbService.addProxy({account_id: 3, host: '185.199.229.156', port: '7492', username: 'raun1234', password: 'raun1234'})
  await manager.startQueue()
})
