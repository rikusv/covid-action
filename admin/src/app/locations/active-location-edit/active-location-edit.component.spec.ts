import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ActiveLocationEditComponent } from './active-location-edit.component'

describe('ActiveLocationEditComponent', () => {
  let component: ActiveLocationEditComponent
  let fixture: ComponentFixture<ActiveLocationEditComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveLocationEditComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveLocationEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
