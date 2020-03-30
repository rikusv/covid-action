import { Component, OnInit, Input } from '@angular/core'

import { Location } from '../../location'

@Component({
  selector: 'app-active-location-view',
  templateUrl: './active-location-view.component.html',
  styleUrls: ['./active-location-view.component.scss']
})
export class ActiveLocationViewComponent implements OnInit {

  @Input() location: Location
  @Input() single: boolean

  constructor() { }

  ngOnInit(): void {
  }

}
