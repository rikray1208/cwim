import { ipcRenderer } from 'electron'
import { AccountsChannels } from '../../../main/types/ipcChannels/AccountsChannels'
import { Account } from '../../../main/types/common'

export const AccountsBridge = {
  getAccounts: (): Promise<Account[]> => ipcRenderer.invoke(AccountsChannels.GET_ACCOUNTS)
}
