import { Injectable, ErrorHandler } from '@angular/core'

import { AlertService } from './alert.service'

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {

  constructor(
    private alertService: AlertService
  ) {}

  handleError(error: Error) {
    const message = error.toString()
    this.alertService.publishError(message)
  }

}
