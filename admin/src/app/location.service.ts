import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

import { Location } from './location'

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  // locations$: Observable<Location[]>

  constructor(
    private angularFirestore: AngularFirestore,
    private router: Router
  ) { }

  getLocations$(): Observable<Location[]> {
    const locationsRef: AngularFirestoreCollection = this.angularFirestore.collection<Location>('locations')
    return locationsRef.valueChanges({idField: 'id'}).pipe(
      map(docs => docs.map(doc => {
        return this.transformFromDatabase(doc)
      }))
    )
  }

  getLocation$(id: string): Observable<Location | null> {
    const locationRef: AngularFirestoreDocument<Location> = this.angularFirestore.doc<Location>(`locations/${id}`)
    return locationRef.valueChanges().pipe(
      map(doc => {
        return doc ? this.transformFromDatabase({id, ...doc}) : null
      })
    )
  }

  saveLocation(location: Location) {
    const [id, data] = this.transformToDatabase(location)
    if (!id) {
      this.createLocation(data)
    } else {
      this.updateLocation(id, data)
    }
  }

  createLocation(data: Partial<Location>) {
    const locationsRef: AngularFirestoreCollection = this.angularFirestore.collection<Location>('locations')
    const id = this.angularFirestore.createId()
    locationsRef.doc(id).set(data)
    .then(() => this.router.navigate(['/locations/active', id]))
    .catch(error => {
      // TODO implement global error handler
      console.log(error)
    })
  }

  updateLocation(id: string, data: Partial<Location>) {
    const locationRef: AngularFirestoreDocument<Location> = this.angularFirestore.doc<Location>(`locations/${id}`)
    locationRef.update(data)
    .catch(error => {
      // TODO implement global error handler
      console.log(error)
    })
  }

  transformToDatabase(location: Location): [string, Partial<Location>] {
    const {id, ...data} = location
    const latitude = Number(location.coordinates.latitude)
    const longitude = Number(location.coordinates.longitude)
    data.coordinates = new firebase.firestore.GeoPoint(latitude, longitude)
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
