import { ipcMain } from 'electron'
import { AccountsChannels } from '../../types/ipcChannels/AccountsChannels'
import { AccountService } from '../../db/Services/Account'

export class AccountsChannelsHandler {
  static getAccounts() {
    return AccountService.getAll()
  }
}

export const accountListener = () => {
  ipcMain.handle(AccountsChannels.GET_ACCOUNTS, AccountsChannelsHandler.getAccounts)
}
