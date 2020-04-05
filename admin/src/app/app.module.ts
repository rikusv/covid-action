import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'

import { environment } from '../environments/environment'

import { AngularFireModule } from '@angular/fire'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LoggedInComponent } from './logged-in/logged-in.component'
import { LocationsComponent } from './locations/locations.component'
import { ActiveLocationEditComponent } from './locations/active-location-edit/active-location-edit.component'
import { ActiveLocationViewComponent } from './locations/active-location-view/active-location-view.component'
import { ActiveLocationListComponent } from './locations/active-location-list/active-location-list.component'

@NgModule({
  declarations: [
    AppComponent,
    LoggedInComponent,
    LocationsComponent,
    ActiveLocationEditComponent,
    ActiveLocationViewComponent,
    ActiveLocationListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
