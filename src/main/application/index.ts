import { app as electronApp, App } from 'electron'
import { WindowsManger } from './WindowsManger'
import { accountsManager } from '../components/Accounts/AccountsManager'
import { dbContext } from '../db/DbContext'
import { authMachine } from '../components/AuthMachine'
import { skinsManager } from '../components/SkinsManager'

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
    authMachine.start()
    accountsManager.init()

    await accountsManager.startQueue()
    await skinsManager.parseSkins()
  } catch (e) {
    console.log('@error', e)
  }
})
