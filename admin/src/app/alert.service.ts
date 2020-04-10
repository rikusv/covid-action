import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'


@Injectable({
  providedIn: 'root'
})
export class AlertService {

  errors$ = new BehaviorSubject<string[]>([])
  success$ = new BehaviorSubject<string[]>([])

  constructor() { }

  publishError(error: string) {
    const alerts = [...this.errors$.value]
    alerts.unshift(error)
    this.errors$.next(alerts)
    setTimeout(() => {
      alerts.pop()
      this.errors$.next(alerts)
    }, 5000)
  }

  publishSuccess(message: string) {
    const alerts = [...this.success$.value]
    alerts.unshift(message)
    this.success$.next(alerts)
    setTimeout(() => {
      alerts.pop()
      this.errors$.next(alerts)
    }, 2000)
  }

  getErrorMessages$() {
    return this.errors$
  }

  getSuccessMessages$() {
    return this.success$
  }
}
