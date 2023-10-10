import { ElectronAPI } from '@electron-toolkit/preload'
import { AccountsBridge } from './Bridges'

interface API {}

declare global {
  interface Window {
    accountsApi: typeof AccountsBridge
  }
}
