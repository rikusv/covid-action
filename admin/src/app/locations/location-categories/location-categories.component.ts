import { Component, OnInit } from '@angular/core'
import { FormBuilder} from '@angular/forms'

import { LocationService } from '../../location.service'

@Component({
  selector: 'app-location-categories',
  templateUrl: './location-categories.component.html',
  styleUrls: ['./location-categories.component.scss']
})
export class LocationCategoriesComponent implements OnInit {

  newcategoryForm = this.fb.group({
    name: ['']
  })
  categories$ = this.locationService.categories$

  constructor(
    private locationService: LocationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  addCategory() {
    this.locationService.enableCategory(this.newcategoryForm.get('name').value)
    this.newcategoryForm.reset()
  }

  enableCategory(name: string) {
    this.locationService.enableCategory(name)
  }

  disableCategory(name: string) {
    this.locationService.disableCategory(name)
  }

}
