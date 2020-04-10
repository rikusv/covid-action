import { Injectable } from '@angular/core'
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import { Observable, from, of } from 'rxjs'
import { catchError, map, switchMap, take } from 'rxjs/operators'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

import { Location, Collection } from './location'
import { UserService } from './user.service'

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(
    private angularFirestore: AngularFirestore,
    private userService: UserService
  ) { }

  get categories(): string[] {
    return [
      'Care Organisation',
      'Drop-off Point',
      'Feeding Scheme',
      'Food Distribution',
      'Other',
      'Shelter',
      'WhatsApp Group',
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

  submitLocation(location: Location): Observable<string | {error: any}> {
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
          return of({error: 'not implemented'})
        }
      })
    )
  }

  savePendingLocation(location: Location): Observable<string | {error: any}> {
    return this.userService.authUser$.pipe(
      take(1),
      switchMap(authUser => {
        const [id, data] = this.transformToDatabase(location, authUser.uid)
        return this.updateLocation('pending-locations', id, data)
      })
    )
  }

  deletePendingLocation(id: string): Observable<string | {error: any}> {
    return this.deleteLocation('pending-locations', id)
  }

  publishLocation(location: Location, collection: Collection): Observable<string | {error: any}> {
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

  createLocation(collection: Collection, data: Partial<Location>): Observable<string | {error: any}> {
    const locationsRef: AngularFirestoreCollection = this.angularFirestore.collection<Location>(collection)
    const id = this.angularFirestore.createId()
    return from(locationsRef.doc(id).set(data)).pipe(
      catchError(error => of(error)),
      map(error => {
        if (error) {
          return { error }
        } else {
          return id
        }
      })
    )
  }

  updateLocation(collection: Collection, id: string, data: Partial<Location>): Observable<string | {error: any}> {
    const locationRef: AngularFirestoreDocument<Location> = this.angularFirestore.doc<Location>(`${collection}/${id}`)
    return from(locationRef.update(data)).pipe(
      catchError(error => of(error)),
      map(error => {
        if (error) {
          return { error }
        } else {
          return id
        }
      })
    )
  }

  promoteLocation(id: string, data: Partial<Location>): Observable<string | {error: any}> {
    const pendingLocationRef = this.angularFirestore.firestore.collection('pending-locations').doc(id)
    const locationRef = this.angularFirestore.firestore.collection('locations').doc(id)
    const batch = this.angularFirestore.firestore.batch()
    batch.set(locationRef, data)
    batch.delete(pendingLocationRef)
    return from(batch.commit()).pipe(
      catchError(error => of(error)),
      map(error => {
        if (error) {
          return { error }
        } else {
          return id
        }
      })
    )
  }

  deleteLocation(collection: Collection, id: string): Observable<string | {error: any}> {
    const locationRef = this.angularFirestore.firestore.collection(collection).doc(id)
    return from(locationRef.delete()).pipe(
      catchError(error => of(error)),
      map(error => {
        if (error) {
          return { error }
        } else {
          return id
        }
      })
    )
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
