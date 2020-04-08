import { Component, OnInit, Input } from '@angular/core'

import { Location, Collection } from '../../location'
import { UserService } from '../../user.service'

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  user$ = this.userService.user$

  @Input() location: Location
  @Input() collection: Collection
  @Input() single: boolean

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

}
