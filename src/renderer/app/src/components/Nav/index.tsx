import React from 'react'
import styles from './styles.module.scss'
import { NavLink } from 'react-router-dom'
import { RouteNames } from '../../routes'

type MyLink = {
  route: RouteNames
  name: string
  disabled: boolean
}

const links: MyLink[] = [
  { route: RouteNames.ACCOUNTS, name: 'accounts', disabled: false },
  { route: RouteNames.SKINS, name: 'skins', disabled: false },
  { route: RouteNames.TRADES, name: 'trades', disabled: false },
  { route: RouteNames.SETTINGS, name: 'settings', disabled: true },
  { route: RouteNames.STATISTICS, name: 'statistics', disabled: true },
  { route: RouteNames.CONTAINERS, name: 'container', disabled: true },
  { route: RouteNames.PARSER, name: 'parser', disabled: true }
]

const Nav: React.FC = () => {
  return (
    <nav className={styles.container}>
      <ul className={styles.list}>
        {links.map((link) => (
          <NavLink
            key={link.route}
            to={link.route}
            className={({ isActive }) =>
              isActive ? `${styles.listItem} ${styles.active}` : `${styles.listItem}`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </ul>
    </nav>
  )
}

export default Nav
