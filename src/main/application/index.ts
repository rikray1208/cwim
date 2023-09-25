import { app as electronApp, App } from 'electron'
import { WindowsManger } from './WindowsManger'
import { dbContext } from '../db/DbContext'
import { AuthMachine } from '../components/AuthMachine'
import { AccountService } from '../db/Services/Account'
import { AccountsManager } from '../components/Accounts/AccountsManager'
import { SkinsManager } from '../components/SkinsManager'

class Application {
  app: App
  windowsManager: WindowsManger
  constructor() {
    this.app = electronApp
    this.windowsManager = new WindowsManger()
  }
}
export const application = new Application()
application.app.on('window-all-closed', () => {
  electronApp.quit()
  process.exit(1)
})

application.app.whenReady().then(async () => {
  try {
    await application.windowsManager.createMainWindow()
    dbContext.init()

    const authMachine = new AuthMachine(1)
    authMachine.start()

    const accounts = AccountService.getAll()
    const manager = new AccountsManager(accounts, authMachine)
    const skinsManager = new SkinsManager(manager.accounts)

    await manager.startQueue()
    await skinsManager.parseSkins()
  } catch (e) {
    console.log('@error', e)
  }
})
