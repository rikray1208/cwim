import { EventEmitter } from 'node:events'

export const AUTH_MACHINE_EVENT = 'auth'

export class AuthMachine extends EventEmitter {
  timeOffset: number

  constructor(timeOffset: number) {
    super()
    this.timeOffset = timeOffset
  }

  public async start() {
    const now = new Date()
    const seconds = now.getSeconds()
    //const timeDelay = seconds < 30 ? (30 + offset) * 1000 : ((60 + offset)  - seconds) * 1000;
    const timeDelay = seconds < 30 ? 30 * 1000 : (60 - seconds) * 1000

    setTimeout(() => {
      this.emit('auth')
      setInterval(() => this.emit(AUTH_MACHINE_EVENT), 30000)
    }, timeDelay)
  }
}
