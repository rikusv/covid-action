import { Injectable } from '@angular/core'
import { AngularFirestore } from '@angular/fire/firestore'
import { Observable, from } from 'rxjs'
import 'firebase/firestore'

import { User } from './user'

@Injectable({
  providedIn: 'root'
})
export class UserAdminService {

  constructor(
    private angularFirestore: AngularFirestore,
  ) { }

  get users$(): Observable<User[]> {
    const queryRef = this.angularFirestore.collection('users', ref => ref.where('email', '>', ''))
    return queryRef.valueChanges({ idField: 'id' })
  }

  removeRole(user: User, role: string): Observable<void | {error: any}> {
    const roles = user.roles
    delete roles[role]
    return from(this.angularFirestore.collection('users').doc(user.id).update({roles}))
  }

  addRole(user: User, role: string): Observable<void | {error: any}> {
    const roles = user.roles
    roles[role] = true
    return from(this.angularFirestore.collection('users').doc(user.id).update({roles}))
  }

}
