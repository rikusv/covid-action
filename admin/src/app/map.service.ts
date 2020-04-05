// TODO: add central error handler

import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import { UserService } from './user.service'
import { PlaceSuggestion } from './place-suggestion'

interface Coordinates {
  latitude: number
  longitude: number
}

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  autoComplete(input: string): Observable<PlaceSuggestion[]> {
    return this.userService.authUser$.pipe(
      switchMap(authUser => authUser.getIdToken()),
      switchMap(token => {
        const options = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            Authorization: token
          })
        }
        const url = `https://europe-west1-covid-action.cloudfunctions.net/placeAutocomplete?input=${input}`
        return this.http.get(url, options) as Observable<PlaceSuggestion[]>
      })
    )
  }

  placeDetails(placeId: string): Observable<Coordinates> {
    return this.userService.authUser$.pipe(
      switchMap(authUser => authUser.getIdToken()),
      switchMap(token => {
        const options = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            Authorization: token
          })
        }
        const url = `https://europe-west1-covid-action.cloudfunctions.net/placeDetails?placeId=${placeId}`
        return this.http.get(url, options) as Observable<Coordinates>
      })
    )
  }

}
