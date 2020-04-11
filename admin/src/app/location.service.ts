import { Injectable } from '@angular/core'
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import { Observable, from, of } from 'rxjs'
import { map, switchMap, take } from 'rxjs/operators'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

import { Location, Collection } from './location'
import { UserService } from './user.service'
import { AlertService } from './alert.service'

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  niceName = {
    locations: 'Location',
    'pending-locations': 'Pending location'
  }

  constructor(
    private angularFirestore: AngularFirestore,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  get categories(): string[] {
    return [
      'Care Organisation',
      'Community Based Organisation',
      'Community Police Forum',
      'Drop-off Point',
      'Feeding Scheme',
      'Food Distribution',
      'Other',
      'Shelter',
      'WhatsApp Group'
    ]
  }

  get tags(): string[] {
    return [
      'animal',
      'clothes',
      'Corona Care',
      'disability',
      'donate',
      'elderly',
      'food',
      'fundraiser',
      'homeless',
      'hygiene',
      'Operation Hunger',
      'volunteer',
      'youth'
    ]
  }

  getLocationCount$(collection: Collection): Observable<number> {
    const locationsRef: AngularFirestoreCollection = this.angularFirestore.collection<Location>(collection)
    return locationsRef.snapshotChanges().pipe(
      map(snapshots => snapshots.length)
    )
  }

  getLocations$(collection: Collection): Observable<Location[]> {
    const locationsRef: AngularFirestoreCollection = this.angularFirestore.collection<Location>(collection)
    return locationsRef.valueChanges({idField: 'id'}).pipe(
      map(docs => docs.map(doc => {
        return this.transformFromDatabase(doc)
      }))
    )
  }

  getSimilarLocations$(field: string, value: string): Observable<Location[]> {
    const queryRef = this.angularFirestore.collection<Location>('locations', ref => ref.where(field, '==', value))
    return queryRef.valueChanges({ idField: 'id' }).pipe(
      map(docs => docs.map(doc => {
        return this.transformFromDatabase(doc)
      }))
    )
  }

  getLocation$(id: string, collection: Collection): Observable<Location | null> {
    const locationRef: AngularFirestoreDocument<Location> = this.angularFirestore.doc<Location>(`${collection}/${id}`)
    return locationRef.valueChanges().pipe(
      map(doc => {
        return doc ? this.transformFromDatabase({id, ...doc}) : null
      })
    )
  }

  submitLocation(location: Location): Observable<boolean> {
    return this.userService.authUser$.pipe(
      take(1),
      switchMap(authUser => {
        const [id, data] = this.transformToDatabase(location, authUser.uid)
        if (!id) {
          data.submittedBy = authUser.uid
          return this.createLocation('pending-locations', data)
        } else {
          // This should not happen yet (until sudmitting changes is implemented)
          alert('Please tell rikusv something is broken.')
          // this.updateLocation(id, data)
          return of(false)
        }
      })
    )
  }

  savePendingLocation(location: Location): Observable<boolean> {
    return this.userService.authUser$.pipe(
      take(1),
      switchMap(authUser => {
        const [id, data] = this.transformToDatabase(location, authUser.uid)
        return this.updateLocation('pending-locations', id, data)
      })
    )
  }

  deletePendingLocation(location: Location): Observable<boolean> {
    return this.deleteLocation('pending-locations', location)
  }

  publishLocation(location: Location, collection: Collection): Observable<boolean> {
    return this.userService.authUser$.pipe(
      take(1),
      switchMap(authUser => {
        const [id, data] = this.transformToDatabase(location, authUser.uid)
        data.publishedBy = authUser.uid
        if (!id) {
          return this.createLocation('locations', data)
        } else if (collection === 'locations') {
          return this.updateLocation(collection, id, data)
        } else {
          return this.promoteLocation(id, data)
        }
      })
    )
  }

  createLocation(collection: Collection, data: Partial<Location>): Observable<boolean> {
    const locationsRef: AngularFirestoreCollection = this.angularFirestore.collection<Location>(collection)
    const id = this.angularFirestore.createId()
    return from(locationsRef.doc(id).set(data)
    .then(() => {
      this.alertService.publishSuccess(`${this.niceName[collection]} ${data.name} created`)
      return true
    })
    .catch(error => {
      this.alertService.publishError(`Could not create ${this.niceName[collection]} - error ${JSON.stringify(error)}`)
      return false
    }))
  }

  updateLocation(collection: Collection, id: string, data: Partial<Location>): Observable<boolean> {
    const locationRef: AngularFirestoreDocument<Location> = this.angularFirestore.doc<Location>(`${collection}/${id}`)
    return from(locationRef.update(data)
    .then(() => {
      this.alertService.publishSuccess(`${this.niceName[collection]} ${data.name} updated`)
      return true
    })
    .catch(error => {
      this.alertService.publishError(`Could not update ${this.niceName[collection]} - error ${JSON.stringify(error)}`)
      return false
    }))
  }

  promoteLocation(id: string, data: Partial<Location>): Observable<boolean> {
    const pendingLocationRef = this.angularFirestore.firestore.collection('pending-locations').doc(id)
    const locationRef = this.angularFirestore.firestore.collection('locations').doc(id)
    const batch = this.angularFirestore.firestore.batch()
    batch.set(locationRef, data)
    batch.delete(pendingLocationRef)
    return from(batch.commit()
    .then(() => {
      this.alertService.publishSuccess(`Location ${data.name} published`)
      return true
    })
    .catch(error => {
      this.alertService.publishError(`Could not publish location - error ${JSON.stringify(error)}`)
      return false
    }))
  }

  deleteLocation(collection: Collection, location: Location): Observable<boolean> {
    const id = location.id
    const locationRef = this.angularFirestore.firestore.collection(collection).doc(id)
    return from(locationRef.delete()
    .then(() => {
      this.alertService.publishSuccess(`${this.niceName[collection]} ${location.name} deleted`)
      return true
    })
    .catch(error => {
      this.alertService.publishError(`Could not delete ${this.niceName[collection]} - error ${JSON.stringify(error)}`)
      return false
    }))
  }

  transformToDatabase(location: Location, uid?: string): [string, Partial<Location>] {
    const {id, ...data} = location
    const latitude = Number(location.coordinates.latitude)
    const longitude = Number(location.coordinates.longitude)
    data.coordinates = new firebase.firestore.GeoPoint(latitude, longitude)
    if (uid) {
      data.touchedBy[uid] = true
      data.changedBy = uid
    } else {
      data.changedBy = ''
    }
    data.changedAt = firebase.firestore.FieldValue.serverTimestamp()
    return [id, data]
  }

  transformFromDatabase(data: Partial<Location>): Location {
    const location = {
      ...data,
      coordinates: {
        latitude: data.coordinates.latitude,
        longitude: data.coordinates.longitude
      }
    } as Location
    return location
  }

}
