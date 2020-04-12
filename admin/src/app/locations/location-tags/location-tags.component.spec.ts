import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { LocationTagsComponent } from './location-tags.component'

describe('LocationTagsComponent', () => {
  let component: LocationTagsComponent
  let fixture: ComponentFixture<LocationTagsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationTagsComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationTagsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
