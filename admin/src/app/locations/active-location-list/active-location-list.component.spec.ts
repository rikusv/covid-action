import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ActiveLocationListComponent } from './active-location-list.component'

describe('ActiveLocationListComponent', () => {
  let component: ActiveLocationListComponent
  let fixture: ComponentFixture<ActiveLocationListComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveLocationListComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveLocationListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
