// import { Component, Input, EventEmitter, Output,OnInit } from '@angular/core';
// import { ReportService } from '../report.service'; // Import the report service
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import * as L from 'leaflet';
// import { Observable, filter, map } from 'rxjs';

// @Component({
//     selector: 'app-map-table',
//     templateUrl: './map-table.component.html',
//     styleUrls: ['./map-table.component.css'],
//   })
//   export class MapTableComponent implements OnInit {
//   // export class AppComponent{
//     title: string = 'Villain Tracker';
//     // @Input()  
//     data:any[]=[];
//     @Output() delete = new EventEmitter()
//     sortDirection: number = 1; 
//     sortedColumn: string = ''; 
//     reportCounts: { [key: string]: number } = {};
  
//     constructor(private rs: ReportService, private router: Router){
//       // this.data = []
//       // moved to report service
//     }
  
//     // onDeleteRow(index: number): void {
//     //   // Remove the item at the specified index from the data array
//     //   this.data.splice(index, 1);
//     // }
//     onDeleteRow(keyToDelete: string): void {
//       const index = this.data.findIndex(item => item.key === keyToDelete);
//       if (index !== -1) {
//         // Remove the item at the specified index from the data array
//         this.data.splice(index, 1);
    
//         // Call the service method to delete the item from the server
//         this.rs.delete(keyToDelete).subscribe({
//           next: (response) => {
//             console.log('Item deleted from server:', response);
//             window.location.reload();
//           },
//           error: (error) => {
//             console.error('Error deleting item:', error);
//           }
//         });
//       } else {
//         console.error('Item not found in data array for deletion');
//       }
//     }
    
//     // onView(){
//     //   this.router.navigate(["report-view"])
//     // }
//     onView(reportData: any): void {
//       this.router.navigate(["report-view"], { state: { report: reportData } });
//     }  
  
//     // sortBy(column: string): void {
//     //   switch (column) {
//     //     case 'location':
//     //       this.data.sort((a, b) => a.location.localeCompare(b.location));
//     //       return;
//     //     case 'villian':
//     //       this.data.sort((a, b) => a.villain.localeCompare(b.villain));
//     //       return;
//     //     case 'time':
//     //       this.data.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
//     //       return;
//     //     case 'status':
//     //       this.data.sort((a, b) => a.status.localeCompare(b.status));
//     //       return;
//     //   }
//     // }
//     sortBy(sort: any) {
//       const data = this.data.slice();
//       if (!sort.active || sort.direction === '') {
//         this.data= data;
//         return;
//       }
//       this.data = data.sort((a, b) => {
//         const isAsc = sort.direction === 'asc';
//         switch (sort.active) {
//           case 'villian': return compare(a.data.name, b.data.name, isAsc);
//           case 'time': return compare(Date.parse(a.data.time), Date.parse(b.data.time), isAsc);
//           case 'location': return compare(a.data.location.locationName, b.data.location.locationName, isAsc);
//           default: return 0;
//         }
//       });
//     }
  
//     ngOnInit(): void {
//       const map = L.map('map').setView([49.25, -122.8], 11);
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; OpenStreetMap contributors'
//       }).addTo(map);
  
//       this.rs.get().subscribe(reports => {
//         this.data = reports;
  
//         // Prepare an object to hold counts for each location
//         const reportCounts: { [key: string]: number } = {};
  
//         // Loop through each report to count occurrences of locations
//         this.data.forEach(report => {
//           const location = report.data.location;
  
//           if (!reportCounts[location]) {
//             reportCounts[location] = 1;
//           } else {
//             reportCounts[location]++;
//           }
  
//           this.rs.getLocationCoordinates(location).subscribe(response => {
//             if (response.length > 0) {
//               const latitude = response[0].lat;
//               const longitude = response[0].lon;
  
//               const marker = L.marker([latitude, longitude]);
//               marker.bindPopup(`
//                 <strong>${location}</strong><br>
//                 ${reportCounts[location]} nuisance reports
//               `);
//               map.addLayer(marker);
//             }
//           });
//         });
//       });
//     }
//   }
  
//   function compare(name: any, name1: any, isAsc: boolean): number {
//     throw new Error('Function not implemented.');
//   }