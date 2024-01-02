import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RoutingModule } from './app-routing.module'; 
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common'; 
import { HttpClientModule } from '@angular/common/http';
import { LocationComponent } from './location/location.component';
import { ReportFormComponent } from './report-form/report-form.component';
import { ReportViewComponent } from './report-view/report-view.component';


import { FormsModule,ReactiveFormsModule } from '@angular/forms';
// import { MapTableComponent } from './map-table/map-table.component';

@NgModule({
  declarations: [
    AppComponent,
    LocationComponent,
    ReportFormComponent,
    ReportViewComponent,
    // MapTableComponent,
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
