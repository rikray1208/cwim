import SteamUser from 'steam-user'
import SteamCommunity from 'steamcommunity'
import TradeOfferManager from 'steam-tradeoffer-manager'
import SteamTotp from 'steam-totp'
import { EconItem } from '../../../types/steam'
import { DbItem, DbItemPrice } from '../../../types/db'
import { itemDbService } from '../../../db/Services/item'

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
  const dbItems = econItems.map<DbItem>((item) => ({
    account_id: accountId,
    name: item.name,
    hashName: item.market_hash_name,
    appid: item.appid,
    icon_url: item.getImageURL(),
    marketable: item.marketable ? 1 : 0,
    tradable: item.tradable ? 1 : 0
  }))
  const dbItemsPrice = dbItems.map<DbItemPrice>((item) => ({ price: 0, hashName: item.hashName }))

  itemDbService.insertItemsPrice(dbItemsPrice)
  itemDbService.insertItems(dbItems)
}
