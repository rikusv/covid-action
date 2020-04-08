import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable, combineLatest, of } from 'rxjs'
import { switchMap, tap } from 'rxjs/operators'

import { Collection } from '../../location'
import { LocationService } from '../../location.service'
import { UserService } from '../../user.service'

@Component({
  selector: 'app-location-view',
  templateUrl: './location-view.component.html',
  styleUrls: ['./location-view.component.scss']
})
export class LocationViewComponent implements OnInit {

  location$: Observable<Location | null>
  collection: Collection
  user$ = this.userService.user$

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private locationService: LocationService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.location$ = combineLatest(this.route.paramMap, this.route.parent.data).pipe(
      switchMap(([paramMap, data]) => {
        const id = paramMap.get('id')
        this.collection = data.collection as Collection
        if (id) {
          return this.locationService.getLocation$(id, this.collection)
        } else {
          return of(null)
        }
      }),
      tap(location => {
        if (!location) {
          this.router.navigate(['/', this.collection])
        }
      })
    )
  }

}
