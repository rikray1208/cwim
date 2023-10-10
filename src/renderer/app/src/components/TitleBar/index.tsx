import React from 'react'
import styles from './styles.module.scss'
import { LucideIcon } from '../ui'

const TitleBar: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>CWIM</h1>
      <div className={styles.btns}>
        <button className={styles.minimizeBtn}>
          <LucideIcon name={'Minus'} color={'#dadada'} size={20} />
        </button>
        <button className={styles.closeBtn}>
          <LucideIcon name={'X'} color={'#dadada'} size={22} />
        </button>
      </div>
    </div>
  )
}

export default TitleBar
