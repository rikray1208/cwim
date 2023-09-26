import { EventEmitter } from 'node:events'

export const AUTH_MACHINE_EVENT = 'auth'

export class AuthMachine extends EventEmitter {
  timeOffset: number

  constructor(timeOffset: number) {
    super()
    this.timeOffset = timeOffset
  }

  public start() {
    const now = new Date()
    const seconds = now.getSeconds()
    const timeDelay = seconds < 30 ? (30 - seconds) * 1000 : (60 - seconds) * 1000

    setTimeout(() => {
      this.emit(AUTH_MACHINE_EVENT)
      setInterval(() => this.emit(AUTH_MACHINE_EVENT), 30000)
    }, timeDelay)
  }
}

export const authMachine = new AuthMachine(1)
