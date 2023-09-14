import { SteamAccount } from './Accounts/SteamAccount'
import { SteamInventory } from '../types/steam'

export class SkinsManager {
  accounts: SteamAccount[]

  constructor(accounts: SteamAccount[]) {
    this.accounts = accounts
  }

  private async getAccountInventories(account: SteamAccount) {
    if (!account.client.steamID) return

    return await new Promise<SteamInventory[]>((resolve, reject) => {
      const appids: SteamInventory[] = []
      // @ts-ignore | bad type in scm
      account.community.getUserInventoryContexts(account.client.steamID!, (err, apps: object) => {
        if (err) reject(err)
        for (const app of Object.entries(apps)) {
          appids.push({ appid: app[0], contextid: Object.keys(app[1].rgContexts)[0] }) // can potentially cause errors
        }
        resolve(appids)
      })
    })
  }

  public async parseSkins() {
    const account = this.accounts[1]
    console.log('@inventories', await this.getAccountInventories(account))

    const invent = await new Promise((resolve, reject) => {
      account.manager.getInventoryContents(730, 2, false, (err: Error, inventory) => {
        if (err) reject(err)

        resolve(inventory)
      })
    })

    console.log(JSON.stringify(invent))
  }
}
