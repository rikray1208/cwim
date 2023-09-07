import { app, BrowserWindow, shell } from 'electron'
import { mainWindowCfg } from './windowsConfig'
import { join } from 'path'

export class WindowsManger {
  mainWindow: BrowserWindow | null

  constructor() {
    this.mainWindow = null
  }

  public async createMainWindow() {
    this.mainWindow = new BrowserWindow({
      ...mainWindowCfg,
      webPreferences: {
        preload: join(__dirname, '../preload/app.js'),
        sandbox: false
      }
    })

    this.mainWindow.on('ready-to-show', () => {
      this?.mainWindow?.show()
    })

    this.mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
      console.log(`${process.env['ELECTRON_RENDERER_URL']}/app/index.html`)
      await this.mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/app/index.html`)
    } else {
      await this.mainWindow.loadFile(join(__dirname, '../renderer/app/index.html'))
    }
  }
}
