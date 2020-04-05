import { Component, OnInit } from '@angular/core'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'
import { Observable, of } from 'rxjs'
import { debounceTime, switchMap, tap, filter } from 'rxjs/operators'
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms'
import { environment } from '../../../environments/environment'

import { Location, Coordinates } from '../../location'
import { LocationService } from '../../location.service'
import { MapService } from '../../map.service'
import { PlaceSuggestion } from '../../place-suggestion'
import { UserService } from '../../user.service'

@Component({
  selector: 'app-active-location-edit',
  templateUrl: './active-location-edit.component.html',
  styleUrls: ['./active-location-edit.component.scss']
})
export class ActiveLocationEditComponent implements OnInit {

  user$ = this.userService.user$
  location$: Observable<Location | null>
  locationForm: FormGroup
  allTags: string[] = [
    'hygiene',
    'food'
  ]
  addressInFocus = false
  addressLoading = false
  addressSuggestions: PlaceSuggestion[] = []
  autocomplete: any
  autocompleteInput: string
  selectedAddress: string
  coordinatesToggle: boolean
  apiKey = environment.firebase.apiKey
  mapUrl: SafeUrl

  constructor(
    private route: ActivatedRoute,
    private locationService: LocationService,
    private mapService: MapService,
    private userService: UserService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.createForm()
    this.location$ = this.route.paramMap.pipe(
      switchMap(paramMap => {
        const id = paramMap.get('id')
        if (id) {
          return this.locationService.getLocation$(id)
        } else {
          return of(null)
        }
      }),
      filter(location => location !== null),
      tap(location => this.updateForm(location))
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
    this.locationForm.get('coordinates').valueChanges.pipe(
      tap(value => this.setMapUrl(value))
    ).subscribe()
  }

  createForm() {
    this.locationForm = this.fb.group({
      id: [''],
      category: ['', Validators.required],
      address: [''],
      coordinates: this.fb.group({
        latitude: [''],
        longitude: ['']
      }),
      description: [''],
      email: ['', Validators.email],
      googlePlaceId: [''],
      name: ['', Validators.required],
      telephone: ['', Validators.pattern('\\+[0-9]*')],
      tags: this.fb.array([]),
      webUrl: ['', Validators.pattern('http.*')],
      whatsAppUrl: ['', Validators.pattern('http.*')],
    })
  }

  updateForm(location: Location) {
    this.locationForm.patchValue(location)
    this.tags.clear()
    if (location.tags) {
      location.tags.forEach(tag => this.addTag(tag))
    }
  }

  get tags(): FormArray {
    return this.locationForm.get('tags') as FormArray
  }

  get availableTags(): string[] {
    const usedTags = this.tags.getRawValue()
    return this.allTags.filter(tag => !usedTags.includes(tag))
  }

  setMapUrl(coordinates: Coordinates) {
    const {latitude, longitude} = coordinates
    if (!latitude || !longitude) {
      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl('')
    } else {
      const url = `https://www.google.com/maps/embed/v1/place?q=${latitude},${longitude}&key=${this.apiKey}`
      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url)
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
    this.locationForm.get('address').setValue(suggestion.address)
    this.locationForm.get('googlePlaceId').setValue(suggestion.placeId)
    this.addressSuggestions = []
    this.mapService.placeDetails(suggestion.placeId).pipe(
      tap(coordinates => this.locationForm.get('coordinates').setValue(coordinates))
    ).subscribe()
  }

  save() {
    const location = this.locationForm.getRawValue()
    this.locationService.saveLocation(location)
  }

}
