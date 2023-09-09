import { app as electronApp, App } from 'electron'
import { WindowsManger } from './WindowsManger'
import { initializeDatabase } from '../db/db'
import { AccountsManager } from '../components/Accounts/AccountsManager'
import { accountsDbService } from '../db/Services/accounts'

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

  const accounts = await accountsDbService.getAccounts()
  const manager = new AccountsManager(accounts)

  await manager.startQueue()
})
