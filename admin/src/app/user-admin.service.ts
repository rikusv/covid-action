import { Injectable } from '@angular/core'
import { AngularFirestore } from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import 'firebase/firestore'

import { User } from './user'
import { AlertService } from './alert.service'

@Injectable({
  providedIn: 'root'
})
export class UserAdminService {

  constructor(
    private angularFirestore: AngularFirestore,
    private alertService: AlertService
  ) { }

  get users$(): Observable<User[]> {
    const queryRef = this.angularFirestore.collection('users', ref => ref.where('email', '>', ''))
    return queryRef.valueChanges({ idField: 'id' })
  }

  removeRole(user: User, role: string) {
    const roles = user.roles
    delete roles[role]
    this.angularFirestore.collection('users').doc(user.id).update({roles})
    .then(() => this.alertService.publishSuccess(`Role ${role} removed from ${user.name || user.email}`))
    .catch(error => this.alertService.publishError(`Could not remove role - error ${error.toString()}`))
  }

  addRole(user: User, role: string) {
    const roles = user.roles || {}
    roles[role] = true
    this.angularFirestore.collection('users').doc(user.id).update({roles})
    .then(() => this.alertService.publishSuccess(`Role ${role} added to ${user.name || user.email}`))
    .catch(error => this.alertService.publishError(`Could not add role - error ${error.toString()}`))
  }

}
