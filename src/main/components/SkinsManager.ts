import { SteamAccount } from './Accounts/SteamAccount'
import { EconItem, SteamInventory } from '../types/steam'
import { delay } from '../utils'
import { saveEconItemsToDb } from '../utils/helpers/steam'
import { accountsManager, AccountsManager } from './Accounts/AccountsManager'

export class SkinsManager {
  accountsManager: AccountsManager

  constructor() {
    this.accountsManager = accountsManager
  }

  private async getAccountInventoriesContext(account: SteamAccount) {
    return await new Promise<SteamInventory[]>((resolve, reject) => {
      const appids: SteamInventory[] = []
      // @ts-ignore | bad type in scm
      account.community.getUserInventoryContexts(account.client.steamID!, (err, apps: object) => {
        if (err) reject(err)
        for (const app of Object.entries(apps)) {
          appids.push({
            appid: Number(app[0]),
            contextid: Number(Object.keys(app[1].rgContexts)[0])
          }) // can potentially cause errors
        }
        resolve(appids)
      })
    })
  }

  public async getAccountInventory(account: SteamAccount, appid: number, contextid: number) {
    return await new Promise<EconItem[]>((resolve, reject) => {
      account.manager.getInventoryContents(
        appid,
        contextid,
        false,
        (err: Error, inventory: EconItem[]) => {
          if (err) reject(err)

          resolve(inventory)
        }
      )
    })
  }

  public async parseSkins() {
    try {
      for (const account of this.accountsManager.accounts) {
        const inventoriesCtx = await this.getAccountInventoriesContext(account)

        for (const { appid, contextid } of inventoriesCtx) {
          const items = await this.getAccountInventory(account, appid, contextid)
          saveEconItemsToDb(account.account.id, items)
          await delay(250)
        }
      }
    } catch (e) {
      console.log('@parse error', e)
    }
  }
}

export const skinsManager = new SkinsManager()
