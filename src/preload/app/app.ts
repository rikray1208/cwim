import { contextBridge } from 'electron'
import { AccountsBridge } from './Bridges'

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('accountsApi', AccountsBridge)
  } catch (error) {
    console.error(error)
  }
}
