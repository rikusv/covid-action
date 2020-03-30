import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ActiveLocationViewComponent } from './active-location-view.component'

describe('ActiveLocationViewComponent', () => {
  let component: ActiveLocationViewComponent
  let fixture: ComponentFixture<ActiveLocationViewComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveLocationViewComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveLocationViewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
