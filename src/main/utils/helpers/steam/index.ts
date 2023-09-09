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

export const getAuthCode = async (shared_secret: string): Promise<string> => {
  return await new Promise((resolve, reject) => {
    SteamTotp.getAuthCode(shared_secret, (err, code: string) => {
      if (err) {
        reject(err)
      } else {
        resolve(code)
      }
    })
  })
}
