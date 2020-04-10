import { Component } from '@angular/core'

import { UserService } from './user.service'
import { AlertService } from './alert.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  authUser$ = this.userService.authUser$
  user$ = this.userService.user$
  errors$ = this.alertService.getErrorMessages$()
  successMessages$ = this.alertService.getSuccessMessages$()

  constructor(
    private userService: UserService,
    private alertService: AlertService
  ) {}

  logout() {
    this.userService.logout()
  }

}
