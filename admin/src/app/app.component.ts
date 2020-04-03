import { Component } from '@angular/core'
import { UserService } from './user.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  authUser$ = this.userService.authUser$
  user$ = this.userService.user$

  constructor(
    private userService: UserService
  ) {}

  login() {
    this.userService.login()
  }
  logout() {
    this.userService.logout()
  }

}
