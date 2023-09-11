import SteamUser from 'steam-user'
import SteamCommunity from 'steamcommunity'
import TradeOfferManager from 'steam-tradeoffer-manager'
import SteamTotp from 'steam-totp'

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
