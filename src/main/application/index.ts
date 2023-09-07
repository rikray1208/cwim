import { app as electronApp, App } from 'electron'
import { WindowsManger } from './WindowsManger'

class Application {
  app: App
  windowsManager: WindowsManger
  constructor() {
    this.app = electronApp
    this.windowsManager = new WindowsManger()

    this.app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        console.log('@window-all-closed')
        electronApp.quit()
        process.exit(1)
      }
    })
  }
}

export const application = new Application()

application.app.whenReady().then(async () => {
  await application.windowsManager.createMainWindow()
})
