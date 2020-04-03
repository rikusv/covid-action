import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AuthGuard } from './auth.guard'

import { LoggedInComponent } from './logged-in/logged-in.component'
import { LocationsComponent } from './locations/locations.component'
import { ActiveLocationEditComponent } from './locations/active-location-edit/active-location-edit.component'
import { ActiveLocationListComponent } from './locations/active-location-list/active-location-list.component'

const routes: Routes = [
  {
    path: '',
    component: LoggedInComponent
  },
  {
    path: 'locations',
    component: LocationsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'add',
        component: ActiveLocationEditComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'admin'
        }
      },
      {
        path: 'active',
        children: [
          {
            path: '',
            component: ActiveLocationListComponent
          },
          {
            path: ':id',
            component: ActiveLocationEditComponent
          }
        ]
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
