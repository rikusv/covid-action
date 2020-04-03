import { Component, OnInit } from '@angular/core'
import { UserService } from '../user.service'

@Component({
  selector: 'app-logged-in',
  templateUrl: './logged-in.component.html',
  styleUrls: ['./logged-in.component.scss']
})
export class LoggedInComponent implements OnInit {

  authUser$ = this.userService.authUser$

  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
  }

}
