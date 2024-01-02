import { Component, Input, EventEmitter, Output,OnInit } from '@angular/core';
import { ReportService } from './report.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { Observable, filter, map } from 'rxjs';
import md5 from 'md5';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
  title: string = 'Villain Tracker';

  data:any[]=[];
  @Output() delete = new EventEmitter()
  sortDirection: number = 1; 
  sortedColumn: string = ''; 
  reportCounts: { [key: string]: number } = {};
  map!: L.Map;

  constructor(private rs: ReportService, private router: Router){
  }

  onDeleteRow(keyToDelete: string): void {
    const enteredPassword = prompt('Enter the password for deletion:', ''); 
    if (enteredPassword === null) {
      console.error('Password entry cancelled');
      return;
    }
    const hashedPassword = md5(enteredPassword);
    const validHash = 'fcab0453879a2b2281bc5073e3f5fe54';

    if (hashedPassword !== validHash) {
      alert('Invalid password')
      console.error('Invalid password');
      return;
    }

    const index = this.data.findIndex(item => item.key === keyToDelete);
    if (index !== -1) {
      // remove the item at the specified index from the data array
      this.data.splice(index, 1);
  
      // call the service method to delete the item from the server
      this.rs.delete(keyToDelete).subscribe({
        next: (response) => {
          console.log('Item deleted from server:', response);
          window.location.reload();
        },
        error: (error) => {
          console.error('Error deleting item:', error);
        }
      });
    } else {
      console.error('Item not found in data array for deletion');
    }
  }  
   
  onView(reportData: any): void {
    if (reportData.key) {
      console.log('Navigating to key:', reportData.key);
      console.log('Navigating to report:', reportData)
      this.router.navigate(["report-view"], { state: { report: reportData } });
    } else {
      console.error('Key is missing in reportData:', reportData);
    }
  }

  sortBy(column: string) {
    if (this.sortedColumn === column) {
      this.sortDirection = -this.sortDirection;
    } else {
      this.sortDirection = 1;
      this.sortedColumn = column;
    }
  
    this.data.sort((a: any, b: any) => {
      const valueA = this.extractValue(a, column);
      const valueB = this.extractValue(b, column);
  
      if (valueA === null || valueB === null) {
        return 0; // handle null values, if any
      }
  
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection * valueA.localeCompare(valueB);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortDirection * (valueA - valueB);
      } else if (valueA instanceof Date && valueB instanceof Date) {
        return this.sortDirection * (valueA.getTime() - valueB.getTime());
      } else {
        return 0; // return 0 for other types (cannot compare)
      }
    });
  }
  
  extractValue(item: any, column: string): any {
    switch (column) {
      case 'location':
        return item.data.location;
      case 'villain':
        return item.data.villain;
      case 'time':
        return new Date(item.data.time);
      case 'status':
        return item.data.status;
      default:
        return null;
    }
  }
  
  

  ngOnInit(): void {
    this.map = L.map('map').setView([49.25, -122.8], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (event) => {
      const latitude = event.latlng.lat;
      const longitude = event.latlng.lng;
      // print latitude and longitude
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    });  

    this.rs.get().subscribe(reports => {
      this.data = reports;

      // prepare an object to hold counts for each location
      const reportCounts: { [key: string]: number } = {};

      // loop through each report to count occurrences of locations
      this.data.forEach(report => {
        const location = report.data.location;

        if (!reportCounts[location]) {
          reportCounts[location] = 1;
        } else {
          reportCounts[location]++;
        }

        this.rs.getLocationCoordinates(location).subscribe(response => {
          if (response.length > 0) {
            const latitude = response[0].lat;
            const longitude = response[0].lon;
            const marker = L.marker([latitude, longitude]);
            marker.bindPopup(`
              <strong>${location}</strong><br>
              ${reportCounts[location]} nuisance reports
            `);
            this.map.addLayer(marker);
          }
          else{
            const lat = report.data.latitude;
            const lon = report.data.longitude;
            const marker = L.marker([lat, lon]);
            marker.bindPopup(`
              <strong>${location}</strong><br>
              ${reportCounts[location]} nuisance reports
            `);
            this.map.addLayer(marker);
          }
        });
      });
    });
  }
}
  
  // ngOnInit(): void {
  //   const map = L.map('map').setView([49.25, -122.8], 11);
  //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     attribution: '&copy; OpenStreetMap contributors'
  //   }).addTo(map);

  //   //new feature
  //   map.on('click', (event) => {
  //     const latitude = event.latlng.lat;
  //     const longitude = event.latlng.lng;

  //     // print latitude and longitude
  //     console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  //   });
  

  //   this.rs.get().subscribe(reports => {
  //     this.data = reports;

  //     // prepare an object to hold counts for each location
  //     const reportCounts: { [key: string]: number } = {};

  //     // loop through each report to count occurrences of locations
  //     this.data.forEach(report => {
  //       const location = report.data.location;

  //       if (!reportCounts[location]) {
  //         reportCounts[location] = 1;
  //       } else {
  //         reportCounts[location]++;
  //       }

  //       this.rs.getLocationCoordinates(location).subscribe(response => {
  //         if (response.length > 0) {
  //           const latitude = response[0].lat;
  //           const longitude = response[0].lon;

  //           const marker = L.marker([latitude, longitude]);
  //           marker.bindPopup(`
  //             <strong>${location}</strong><br>
  //             ${reportCounts[location]} nuisance reports
  //           `);
  //           map.addLayer(marker);
  //         }
  //       });
  //     });
  //   });
  // }

