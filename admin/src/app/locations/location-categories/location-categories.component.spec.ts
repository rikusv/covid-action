import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { LocationCategoriesComponent } from './location-categories.component'

describe('LocationCategoriesComponent', () => {
  let component: LocationCategoriesComponent
  let fixture: ComponentFixture<LocationCategoriesComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationCategoriesComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationCategoriesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
