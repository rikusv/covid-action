import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { filter, map, switchMap, take } from 'rxjs/operators'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, DocumentSnapshot, DocumentData } from '@angular/fire/firestore'
import { auth, User as AuthUser } from 'firebase/app'
import 'firebase/firestore'

import { User } from './user'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth
  ) { }

  login() {
    this.angularFireAuth.signInWithPopup(new auth.GoogleAuthProvider())
  }
  logout() {
    this.angularFireAuth.signOut()
  }

  get authUser$(): Observable<AuthUser> {
    return this.angularFireAuth.user
  }

  get user$(): Observable<User> {
    return this.authUser$.pipe(
      filter(authUser => authUser !== null),
      take(1),
      switchMap(authUser => this.angularFirestore.collection('users').doc(authUser.uid).get()),
      map((snapshot: DocumentSnapshot<DocumentData>) => snapshot.exists ? snapshot.data() as User : null)
    )
  }

}
