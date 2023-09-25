import SteamUser from 'steam-user'
import SteamCommunity from 'steamcommunity'
import TradeOfferManager from 'steam-tradeoffer-manager'
import SteamTotp from 'steam-totp'
import { EconItem } from '../../../types/steam'
import { ItemPriceService } from '../../../db/Services/ItemPrice'
import { ItemService } from '../../../db/Services/Item'

export const steamInitialization = (options?: object) => {
  const client = new SteamUser(options || {})
  const community = new SteamCommunity()
  const manager = new TradeOfferManager({
    steam: client,
    community: community,
    language: 'en'
  })

  return { client, manager, community }
}

export const generate32BitInteger = () => {
  return Math.floor(Math.random() * 4294967296)
}

export const getTimeOffset = () => {
  return new Promise<number>((resolve, reject) => {
    SteamTotp.getTimeOffset((err, offset: number) => {
      if (err) {
        reject(err)
      } else {
        resolve(offset)
      }
    })
  })
}

export const saveEconItemsToDb = (accountId: number, econItems: EconItem[]) => {
  const dbItems = econItems.map((item) => ({
    id: 0,
    account_id: accountId,
    name: item.name,
    hashName: item.market_hash_name,
    appid: item.appid,
    icon_url: item.getImageURL(),
    marketable: item.marketable ? 1 : 0,
    tradable: item.tradable ? 1 : 0
  }))
  const dbItemsPrice = dbItems.map((item) => ({ price: 0, hashName: item.hashName }))

  ItemPriceService.bulkAdd(dbItemsPrice, true)
  ItemService.bulkAdd(dbItems)
}
