import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Observable, of } from 'rxjs'
import { switchMap, tap, filter } from 'rxjs/operators'
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms'

import { Location } from '../../location'
import { LocationService } from '../../location.service'

@Component({
  selector: 'app-active-location-edit',
  templateUrl: './active-location-edit.component.html',
  styleUrls: ['./active-location-edit.component.scss']
})
export class ActiveLocationEditComponent implements OnInit {

  location$: Observable<Location | null>
  locationForm: FormGroup
  allTags: string[] = [
    'hygiene',
    'food',
    'etc',
    'bla',
    'kjashkjasdhkdhak',
    'lkdlsakjdlkj'
  ]

  constructor(
    private route: ActivatedRoute,
    private locationService: LocationService,
    private fb: FormBuilder
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
  }

  createForm() {
    this.locationForm = this.fb.group({
      id: [''],
      category: ['', Validators.required],
      coordinates: this.fb.group({
        latitude: [''],
        longitude: ['']
      }),
      description: [''],
      email: ['', Validators.email],
      name: ['', Validators.required],
      telephone: ['+27', Validators.pattern('\\+[0-9]*')],
      tags: this.fb.array([]),
      webUrl: ['', Validators.pattern('http.*')],
      whatsAppUrl: ['', Validators.pattern('http.*')],
    })
  }

  updateForm(location: Location) {
    this.locationForm.patchValue(location)
    this.tags.clear()
    location.tags.forEach(tag => this.addTag(tag))
  }

  get tags() {
    return this.locationForm.get('tags') as FormArray
  }

  get availableTags(): string[] {
    const usedTags = this.tags.getRawValue()
    return this.allTags.filter(tag => !usedTags.includes(tag))
  }

  addTag(tag: string) {
    this.tags.push(this.fb.control(tag))
  }

  removeTag(index: number) {
    this.tags.removeAt(index)
  }

  save() {
    const location = this.locationForm.getRawValue()
    this.locationService.saveLocation(location)
  }

}
