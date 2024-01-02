import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LocationComponent } from './location/location.component';
import { ReportFormComponent } from './report-form/report-form.component';
import { ReportViewComponent } from './report-view/report-view.component';
import { AppComponent } from './app.component';
// import { MapTableComponent } from './map-table/map-table.component';

const appRoutes: Routes = [
  { path: 'report-view', component: ReportViewComponent },
  // { path: 'location', component: LocationComponent },
  // { path: 'map-table', component: MapTableComponent },
  { path: 'report-form', component: ReportFormComponent },
  // { path: 'report-view', component: ReportViewComponent },
  { path:'', component:AppComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class RoutingModule { }
