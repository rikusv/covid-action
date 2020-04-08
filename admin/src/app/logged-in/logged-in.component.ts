import { Component, OnInit } from '@angular/core'

import { UserService } from '../user.service'
import { LocationService } from '../location.service'

@Component({
  selector: 'app-logged-in',
  templateUrl: './logged-in.component.html',
  styleUrls: ['./logged-in.component.scss']
})
export class LoggedInComponent implements OnInit {

  user$ = this.userService.user$
  authUser$ = this.userService.authUser$
  pendingLocationCount$ = this.locationService.getLocationCount$('pending-locations')

  constructor(
    private userService: UserService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
  }

}
