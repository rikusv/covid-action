import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { AngularFireAuth } from '@angular/fire/auth'
import { auth, User } from 'firebase/app'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    public angularFireAuth: AngularFireAuth
  ) { }

  login() {
    this.angularFireAuth.signInWithPopup(new auth.GoogleAuthProvider())
  }
  logout() {
    this.angularFireAuth.signOut()
  }

  get user$(): Observable<User> {
    return this.angularFireAuth.user
  }

}
