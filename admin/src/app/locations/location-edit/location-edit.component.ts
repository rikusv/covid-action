import { Component, OnInit } from '@angular/core'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { ActivatedRoute, Router } from '@angular/router'
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs'
import { debounceTime, switchMap, tap, filter, take } from 'rxjs/operators'
import { AbstractControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms'
import { environment } from '../../../environments/environment'

import { Location, Collection } from '../../location'
import { LocationService } from '../../location.service'
import { MapService } from '../../map.service'
import { PlaceSuggestion } from '../../place-suggestion'
import { UserService } from '../../user.service'

@Component({
  selector: 'app-location-edit',
  templateUrl: './location-edit.component.html',
  styleUrls: ['./location-edit.component.scss']
})
export class LocationEditComponent implements OnInit {

  heading: [string, string] = ['', '']
  user$ = this.userService.user$
  location$: Observable<Location | null>
  new: boolean
  path: string
  collection: Collection
  locationForm: FormGroup
  categories = this.locationService.categories
  allTags = this.locationService.tags
  addressInFocus = false
  addressLoading = false
  addressSuggestions: PlaceSuggestion[] = []
  autocomplete: any
  autocompleteInput: string
  selectedAddress: string
  coordinatesToggle: boolean
  apiKey = environment.firebase.apiKey
  mapUrl: SafeUrl
  showMap: boolean
  alert$: BehaviorSubject<{type: 'danger' | 'success', text: string}> = new BehaviorSubject(null)

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private locationService: LocationService,
    private mapService: MapService,
    private userService: UserService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.createForm()
    this.location$ = combineLatest(this.route.url, this.route.paramMap, this.route.parent.data).pipe(
      switchMap(([url, paramMap, data]) => {
        this.path = url[0].path
        const id = paramMap.get('id')
        this.collection = data.collection as Collection
        if (id) {
          return this.locationService.getLocation$(id, this.collection)
        } else {
          this.new = true
          return of(null)
        }
      }),
      tap(location => {
        if (this.path === 'submit') {
          this.heading = ['Submit', 'new location for approval']
        } else if (this.path === 'add') {
          this.heading = ['Add', 'publish new location']
        } else if (this.collection === 'locations') {
          this.heading = ['Edit', 'published location']
        } else {
          this.heading = ['Edit / Publish', 'pending location']
        }
        if (location === null) {
          if (!this.new) {
            this.router.navigate(['/', this.collection])
          }
        } else {
          this.updateForm(location)
        }
      })
    )
    this.locationForm.get('address').valueChanges.pipe(
      filter(() => this.addressInFocus),
      tap(value => {
        if (!value.length) {
          this.addressSuggestions = []
        }
      }),
      filter(value => value.length > 2 && value !== this.selectedAddress),
      debounceTime(500),
      tap(() => this.addressLoading = true),
      switchMap(input => this.mapService.autoComplete(input)),
      tap((suggestions: any[]) => {
        this.addressSuggestions = suggestions
        this.addressLoading = false
      })
    ).subscribe()
    combineLatest(this.latitude.valueChanges, this.longitude.valueChanges).pipe(
      tap(([latitude, longitude]) => {
        this.setMapUrl(latitude, longitude)
      })
    ).subscribe()
  }

  createForm() {
    this.showMap = false
    this.locationForm = this.fb.group({
      id: [''],
      category: ['', Validators.required],
      address: [''],
      coordinates: this.fb.group({
        latitude: ['', [
          Validators.pattern('^[^0][-]{0,1}[0-9]+(?:\.[0-9]*)*$'),
          Validators.required
        ]],
        longitude: ['', [
          Validators.pattern('^[^0][-]{0,1}[0-9]+(?:\.[0-9]*)*$'),
          Validators.required
        ]]
      }),
      description: [''],
      changedAt: [''],
      changedBy: [''],
      email: ['', Validators.email],
      googlePlaceId: [''],
      name: ['', Validators.required],
      publishedBy: [''],
      submittedBy: [''],
      telephone: ['', Validators.pattern('\\+[0-9]*')],
      touchedBy: this.fb.group({}),
      tags: this.fb.array([]),
      webUrl: ['', Validators.pattern('http.*')],
      whatsAppUrl: ['', Validators.pattern('http.*')]
    })
  }

  updateForm(location: Location) {
    this.locationForm.patchValue(location)
    this.tags.clear()
    if (location.tags) {
      location.tags.forEach(tag => this.addTag(tag))
    }
  }

  get address(): AbstractControl {
    return this.locationForm.get('address')
  }

  get category(): AbstractControl {
    return this.locationForm.get('category')
  }

  get latitude(): AbstractControl {
    return this.locationForm.get('coordinates').get('latitude')
  }

  get longitude(): AbstractControl {
    return this.locationForm.get('coordinates').get('longitude')
  }

  get email(): AbstractControl {
    return this.locationForm.get('email')
  }

  get googlePlaceId(): AbstractControl {
    return this.locationForm.get('googlePlaceId')
  }

  get name(): AbstractControl {
    return this.locationForm.get('name')
  }

  get telephone(): AbstractControl {
    return this.locationForm.get('telephone')
  }

  get webUrl(): AbstractControl {
    return this.locationForm.get('webUrl')
  }

  get whatsAppUrl(): AbstractControl {
    return this.locationForm.get('whatsAppUrl')
  }

  get tags(): FormArray {
    return this.locationForm.get('tags') as FormArray
  }

  get availableTags(): string[] {
    const usedTags = this.tags.getRawValue()
    return this.allTags.filter(tag => !usedTags.includes(tag))
  }

  setMapUrl(latitude: number, longitude: number) {
    if (!latitude || !longitude) {
      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl('')
      this.showMap = false
    } else {
      const url = `https://www.google.com/maps/embed/v1/place?q=${latitude},${longitude}&key=${this.apiKey}`
      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url)
      this.showMap = true
    }
  }

  addTag(tag: string) {
    this.tags.push(this.fb.control(tag))
  }

  removeTag(index: number) {
    this.tags.removeAt(index)
  }

  toggleCoordinates(checked: boolean) {
    this.coordinatesToggle = checked
  }

  setAddress(suggestion: PlaceSuggestion) {
    this.selectedAddress = suggestion.address
    this.address.setValue(suggestion.address)
    this.googlePlaceId.setValue(suggestion.placeId)
    this.addressSuggestions = []
    this.mapService.placeDetails(suggestion.placeId).pipe(
      tap(coordinates => this.locationForm.get('coordinates').setValue(coordinates))
    ).subscribe()
  }

  submit() {
    const location = this.locationForm.getRawValue()
    this.locationService.submitLocation(location).pipe(
      take(1),
      tap(response => {
        if (typeof response === 'string') {
          this.alert$.next({
            type: 'success',
            text: `Record ${response} submitted`
          })
          this.createForm()
        } else {
          this.alert$.next({
            type: 'danger',
            text: `Error: ${JSON.stringify(response.error)}`
          })
        }
      })
    ).subscribe()
  }

  save() {
    const location = this.locationForm.getRawValue()
    this.locationService.savePendingLocation(location).pipe(
      take(1),
      tap(response => {
        if (typeof response === 'string') {
          this.alert$.next({
            type: 'success',
            text: `Record ${response} saved`
          })
          this.router.navigate(['/', this.collection])
        } else {
          this.alert$.next({
            type: 'danger',
            text: `Error: ${JSON.stringify(response.error)}`
          })
        }
      })
    ).subscribe()
  }

  delete() {
    const location = this.locationForm.getRawValue()
    this.locationService.deletePendingLocation(location.id).pipe(
      take(1),
      tap(response => {
        if (typeof response === 'string') {
          this.alert$.next({
            type: 'success',
            text: `Record ${response} saved`
          })
          this.router.navigate(['/', this.collection])
        } else {
          this.alert$.next({
            type: 'danger',
            text: `Error: ${JSON.stringify(response.error)}`
          })
        }
      })
    ).subscribe()
  }

  publish() {
    const location = this.locationForm.getRawValue()
    this.locationService.publishLocation(location, this.collection).pipe(
      take(1),
      tap(response => {
        if (typeof response === 'string') {
          this.alert$.next({
            type: 'success',
            text: `Record ${response} published`
          })
          this.router.navigate(['/', this.collection])
        } else {
          this.alert$.next({
            type: 'danger',
            text: `Error: ${JSON.stringify(response.error)}`
          })
        }
      })
    ).subscribe()
  }

}
