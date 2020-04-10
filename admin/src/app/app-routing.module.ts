import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AuthGuard } from './auth.guard'

import { LoggedInComponent } from './logged-in/logged-in.component'
import { LocationsComponent } from './locations/locations.component'
import { LocationListComponent } from './locations/location-list/location-list.component'
import { LocationViewComponent } from './locations/location-view/location-view.component'
import { LocationEditComponent } from './locations/location-edit/location-edit.component'
import { UsersComponent } from './users/users.component'

const routes: Routes = [
  {
    path: '',
    component: LoggedInComponent
  },
  {
    path: 'locations',
    data: {
      collection: 'locations'
    },
    component: LocationsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: LocationListComponent
      },
      {
        path: 'submit',
        component: LocationEditComponent
      },
      {
        path: 'add',
        component: LocationEditComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'admin'
        }
      },
      {
        path: ':id',
        component: LocationViewComponent
      },
      {
        path: ':id/edit',
        component: LocationEditComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'admin'
        }
      }
    ]
  },
  {
    path: 'pending-locations',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
      collection: 'pending-locations'
    },
    children: [
      {
        path: '',
        component: LocationListComponent
      },
      {
        path: ':id',
        component: LocationEditComponent
      }
    ]
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'admin'
    },
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
