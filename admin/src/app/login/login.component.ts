import { Component, OnInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { auth } from 'firebase/app'
import { Observable } from 'rxjs'

import { UserService } from '../user.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  phoneNumber = new FormControl('', Validators.pattern('\\+[0-9]*'))
  verificationCode = new FormControl('')
  confirmationResult$: Observable<auth.ConfirmationResult>

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  loginWithGoogle() {
    this.userService.loginWithGoogle()
  }

  loginWithPhone() {
    this.confirmationResult$ = this.userService.loginWithPhone(this.phoneNumber.value)
  }

  loginWithPhoneConfirm(confirmationResult: auth.ConfirmationResult) {
    this.userService.loginWithPhoneConfirm(confirmationResult, this.verificationCode.value)
  }

}
