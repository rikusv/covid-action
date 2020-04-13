import { Component, OnInit } from '@angular/core'
import { UserAdminService } from '../user-admin.service'
import { User } from '../user'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users$ = this.userAdminService.users$

  constructor(
    private userAdminService: UserAdminService
  ) { }

  ngOnInit(): void {
  }

  removeRole(user: User, role: string) {
    this.userAdminService.removeRole(user, role)
  }

  addRole(user: User, role: string) {
    this.userAdminService.addRole(user, role)
  }

  keysFromMap(map: any): any[] {
    return Object.keys(map || {})
  }

}
