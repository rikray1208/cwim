import SteamUser from 'steam-user'
import SteamCommunity from 'steamcommunity'
import TradeOfferManager from 'steam-tradeoffer-manager'

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
