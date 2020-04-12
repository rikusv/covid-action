import { Component, OnInit } from '@angular/core'
import { FormBuilder} from '@angular/forms'

import { LocationService } from '../../location.service'

@Component({
  selector: 'app-location-tags',
  templateUrl: './location-tags.component.html',
  styleUrls: ['./location-tags.component.scss']
})
export class LocationTagsComponent implements OnInit {

  newTagForm = this.fb.group({
    name: ['']
  })
  tags$ = this.locationService.tags$

  constructor(
    private locationService: LocationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  addTag() {
    this.locationService.enableTag(this.newTagForm.get('name').value)
    this.newTagForm.reset()
  }

  enableTag(name: string) {
    this.locationService.enableTag(name)
  }

  disableTag(name: string) {
    this.locationService.disableTag(name)
  }

}
