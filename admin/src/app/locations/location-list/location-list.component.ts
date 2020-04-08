import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs'
import { switchMap, tap } from 'rxjs/operators'

import { LocationService } from '../../location.service'
import { Location, Collection } from '../../location'

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent implements OnInit {

  locations$: Observable<Location[]>
  collection: Collection

  constructor(
    private locationService: LocationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.locations$ = this.route.data.pipe(
      tap(data => this.collection = data.collection),
      switchMap(data => this.locationService.getLocations$(data.collection))
    )
  }

}
