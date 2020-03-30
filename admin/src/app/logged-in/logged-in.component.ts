import { Component, OnInit } from '@angular/core'
import { UserService } from '../user.service'

@Component({
  selector: 'app-logged-in',
  templateUrl: './logged-in.component.html',
  styleUrls: ['./logged-in.component.scss']
})
export class LoggedInComponent implements OnInit {

  user$ = this.userService.user$

  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
  }

}
