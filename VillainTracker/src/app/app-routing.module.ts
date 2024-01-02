import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LocationComponent } from './location/location.component';
import { ReportFormComponent } from './report-form/report-form.component';
import { ReportViewComponent } from './report-view/report-view.component';

const appRoutes: Routes = [
  { path: 'location', component: LocationComponent },
  { path: 'report-form', component: ReportFormComponent },
  { path: 'report-view', component: ReportViewComponent },
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
