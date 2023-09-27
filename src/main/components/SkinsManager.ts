import { SteamAccount } from './Accounts/SteamAccount'
import { EconItem, SteamInventory } from '../types/steam'
import { delay } from '../utils'
import { saveEconItemsToDb } from '../utils/helpers/steam'
import { accountsManager, AccountsManager } from './Accounts/AccountsManager'
import axios from 'axios'
import { ItemService } from '../db/Services/Item'
import { ItemPriceService } from '../db/Services/ItemPrice'
const cheerio = require('cheerio')

export class SkinsManager {
  accountsManager: AccountsManager
  public isUpdating: {
    status: boolean
    total: number
    current: number
  }

  constructor() {
    this.accountsManager = accountsManager
    this.isUpdating = { status: false, current: 0, total: 0 }
  }

  private setIsUpdating(newValue: Partial<typeof this.isUpdating>) {
    this.isUpdating = { ...this.isUpdating, ...newValue }
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

  public async parseAllSkins() {
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

  public async updateAllPrices() {
    const skins = ItemService.getAllGroupByName()

    this.setIsUpdating({ status: true, total: skins.length })

    for (let i = 0; i < skins.length; i++) {
      const skin = skins[i]
      const price = await this.getItemPrice(skin.appid, skin.hashName)

      ItemPriceService.update(skin.hashName, { price: price })

      this.setIsUpdating({ current: i })
      await delay(5000)
    }

    this.setIsUpdating({ status: false, current: 0, total: 0 })
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
  private async getItemPrice(appid: number, hashName: string) {
    let n = 0
    while (n < 3) {
      try {
        const uri = `https://steamcommunity.com/market/listings/${appid}/${encodeURIComponent(
          hashName
        )}`
        const { data } = await axios.get(uri)
        const $ = cheerio.load(data)

        let line1Array = []

        $('script').each((_, element) => {
          const script = $(element).html()
          const startPattern = 'var line1='
          const endPattern = '];'

          const startIndex = script.indexOf(startPattern)
          const endIndex = script.indexOf(endPattern, startIndex)

          if (startIndex !== -1 && endIndex !== -1) {
            const line1String = script.slice(
              startIndex + startPattern.length,
              endIndex + endPattern.length
            )
            line1Array = eval(line1String)
            return false
          }

          return true
        })

        if (line1Array[line1Array.length - 1]) {
          return line1Array[line1Array.length - 1][1]
        }

        return 0
      } catch (e) {
        console.log('@getItemPrice error', e)
        n++
        await delay(60000)
      }
    }

    throw new Error('Failed to get price')
  }
}

export const skinsManager = new SkinsManager()
