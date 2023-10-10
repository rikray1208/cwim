import { app as electronApp, App } from 'electron'
import { WindowsManger } from './WindowsManger'
import { dbContext } from '../db/DbContext'
import { authMachine } from '../components/AuthMachine'
import { accountsManager } from '../components/Accounts/AccountsManager'
import { optimizer } from '@electron-toolkit/utils'
import { startIpcListeners } from './ipcMain/listeners'

class Application {
  app: App
  windowsManager: WindowsManger
  constructor() {
    this.app = electronApp
    this.windowsManager = new WindowsManger()

    this.app.on('window-all-closed', () => {
      this.app.quit()
      process.exit(1)
    })

    this.app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })
  }

  start() {
    this.app.whenReady().then(async () => {
      try {
        await this.windowsManager.createMainWindow()
        startIpcListeners()
        await this.initStartData()
      } catch (error) {
        console.log(error)
      }
    })
  }

  async initStartData() {
    dbContext.init()
    authMachine.start()
    accountsManager.init()

    await accountsManager.startQueue()
  }
}
export const application = new Application()
