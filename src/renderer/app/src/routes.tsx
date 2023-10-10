import { ActionFunction } from 'react-router-dom'
import { Home, Accounts, Skins, Trades } from './pages'

export interface IRoute {
  path: RouteNames
  action?: ActionFunction
  element: React.ReactElement
}

export enum RouteNames {
  HOME = '/',
  ACCOUNTS = '/accounts',
  SKINS = '/skins',
  TRADES = '/trades',
  SETTINGS = '/settings',
  CONTAINERS = '/containers',
  STATISTICS = '/statistics',
  PARSER = '/parser'
}

export const AppRoutes: IRoute[] = [
  { path: RouteNames.HOME, element: <Home /> },
  { path: RouteNames.ACCOUNTS, element: <Accounts /> },
  { path: RouteNames.SKINS, element: <Skins /> },
  { path: RouteNames.TRADES, element: <Trades /> }
]
