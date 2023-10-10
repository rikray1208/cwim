import { accountListener } from './accounts'

export const startIpcListeners = () => {
  accountListener()
}
