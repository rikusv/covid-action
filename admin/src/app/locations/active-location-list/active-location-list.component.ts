import { Component, OnInit } from '@angular/core'

import { LocationService } from '../../location.service'

@Component({
  selector: 'app-active-location-list',
  templateUrl: './active-location-list.component.html',
  styleUrls: ['./active-location-list.component.scss']
})
export class ActiveLocationListComponent implements OnInit {

  locations$ = this.locationService.getLocations$()

  constructor(
    private locationService: LocationService
  ) { }

  ngOnInit(): void {
  }

}
