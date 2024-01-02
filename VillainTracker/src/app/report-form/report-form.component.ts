import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms'
import { ReportService } from '../report.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import * as L from 'leaflet';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})

// export class ReportFormComponent implements OnInit{


export class ReportFormComponent{
  locations: string[] = [];
  filteredLocations: string[] = [];

  form: FormGroup;
  // data:Report[]=[] //any
  data: any;
  imageUrl: any;
  constructor(private rs: ReportService, private router:Router, private http: HttpClient, private appComponent: AppComponent){
    let formControlls = {
      villain: new FormControl(''),
      location: new FormControl(''),
      witness: new FormControl(''),
      time:new FormControl(new Date().getTime()),
      status:new FormControl('OPEN'),
      extra:new FormControl(''),
      image:new FormControl(''),
      // new feature
      latitude: new FormControl(''), 
      longitude: new FormControl(''), 
    }
    this.form = new FormGroup(formControlls)
    this.loadData();
    this.loadLocations(); 
  }

  loadLocations() {
    this.rs.get().subscribe((data) => {
        this.locations = data.map((item: any) => item.data.location); // Extract existing locations
    });
  }

  onLocationInput(event: any) {
    const value = event.target.value.toLowerCase();
    this.filteredLocations = this.locations.filter(location => location.toLowerCase().includes(value));
  }

  loadData() {
    this.rs.get().subscribe((data) => {
      this.data = data;
    });
  }

  goBack(): void {
    this.router.navigate([""]);
  }
  
  // convert image url to base64 encoded string so that the url is not fakepath
  // onSubmit(newReport: any) {
    
  //   const imageInput = document.getElementById('imageInput') as HTMLInputElement;
  //   const file: File | null = imageInput ? (imageInput.files ? imageInput.files[0] : null) : null;
  
  //   if (file && file instanceof File) {
  //     const reader = new FileReader();
  
  //     reader.onload = (event: any) => {
  //       newReport.image = event.target.result; // use the result as the image URL
        
  //       this.rs.add({ data: newReport }).subscribe((response) => {
  //         this.loadData();
  //         window.location.reload(); 
  //         this.router.navigate([""]);        
  //       });
  //     };
  
  //     reader.readAsDataURL(file); // read the file as a data URL
  //   } else {
  //     this.rs.add({ data: newReport}).subscribe((response) => {
  //       this.loadData();
  //       window.location.reload();
  //       this.router.navigate([""]);       
  //     });
  //   }
  //   // this.router.navigate([""]);
  // }
  



  // new features
  onSubmit(newReport: any) {
    const imageInput = document.getElementById('imageInput') as HTMLInputElement;
    const file: File | null = imageInput ? (imageInput.files ? imageInput.files[0] : null) : null;
  
    if (file && file instanceof File) {
      const reader = new FileReader();
  
      reader.onload = (event: any) => {
        newReport.image = event.target.result; // use the result as the image URL
  
        // Check if latitude and longitude are provided
        if (newReport.latitude && newReport.longitude) {
          // If latitude and longitude are manually provided, create the marker
          const latitude = parseFloat(newReport.latitude);
          const longitude = parseFloat(newReport.longitude);
          this.appComponent.map.setView([latitude, longitude], 11); 
          this.createMarker(latitude, longitude, newReport);
        } else {
          // Otherwise, use the Nominatim API to get coordinates
          this.rs.getLocationCoordinates(newReport.location).subscribe((response) => {
            if (response.length > 0) {
              const latitude = parseFloat(response[0].lat);
              const longitude = parseFloat(response[0].lon);
              this.createMarker(latitude, longitude, newReport);
            } else {
              // Handle case when location doesn't exist in Nominatim
              alert('Location not found. Please provide latitude and longitude manually.');
              // You can handle this situation according to your application's flow
            }
          });
        }
  
        // Add the new report to the service
        this.rs.add({ data: newReport }).subscribe((response) => {
          this.loadData();
          window.location.reload();
          this.router.navigate([""]);
        });
      };
  
      reader.readAsDataURL(file); // read the file as a data URL
    } else {
      // If there's no file, directly handle adding the report without an image
      // Same logic as above for handling latitude, longitude, and adding the report
      // ...
      if (newReport.latitude && newReport.longitude) {
        // If latitude and longitude are manually provided, create the marker
        const latitude = parseFloat(newReport.latitude);
        const longitude = parseFloat(newReport.longitude);
        this.appComponent.map.setView([latitude, longitude], 11); 
        this.createMarker(latitude, longitude, newReport);
      } else {
        // Otherwise, use the Nominatim API to get coordinates
        this.rs.getLocationCoordinates(newReport.location).subscribe((response) => {
          if (response.length > 0) {
            const latitude = parseFloat(response[0].lat);
            const longitude = parseFloat(response[0].lon);
            this.createMarker(latitude, longitude, newReport);
          } else {
            // Handle case when location doesn't exist in Nominatim
            alert('Location not found. Please provide latitude and longitude manually.');
            // You can handle this situation according to your application's flow
          }
        });
      }

      this.rs.add({ data: newReport }).subscribe((response) => {
        this.loadData();
        window.location.reload();
        this.router.navigate([""]);
      });
    }
  }
  
  createMarker(latitude: number, longitude: number, newReport: any) {
    // Use latitude and longitude to create a marker
    // This part will create the marker on the map
    // You can use the Leaflet library to add a marker to the map

    const marker = L.marker([latitude, longitude]);
    marker.bindPopup(`
      <strong>${newReport.location}</strong><br>
      Nuisance report
    `);
    this.appComponent.map.addLayer(marker);
    // ... rest of your logic to handle the marker on the map
    // Update your form submission logic or other functionality accordingly
  }
}
