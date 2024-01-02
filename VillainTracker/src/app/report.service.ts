import { Injectable , OnInit} from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ReportService {

  apiUrl = 'https://272.selfip.net/apps/17gkVdauOU/collections/data1/documents/';

  constructor(private http: HttpClient) {}

  get(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }


  add(newReport: any): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      switchMap((data: any) => {
        const latestKey = data.length > 0 ? Math.max(...data.map((item: any) => +item.key)) : -1;
        const newKey = String(latestKey + 1); // set the key for the newReport
        newReport.key = newKey;
        return of(newReport); // return the new report object with the extracted image URL
      }),
      switchMap((reportWithKey: any) => {
        return this.http.post<any>(this.apiUrl, reportWithKey); // post the new report to the server
      })
    );
  }
  
  
  delete(key: string): Observable<any> {
    const deleteUrl = `${this.apiUrl}/${key}`;
    return this.http.delete<any>(deleteUrl);
  }


  // get the latitude and longitude by adding the location name after the api URL
  getLocationCoordinates(locationName: string): Observable<any> {
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${locationName}`;
    return this.http.get<any>(apiUrl);
  }


  updateReport(key: string, updatedReport: any): Observable<any> {
    const updateUrl = `${this.apiUrl}/${key}`;
    return this.http.put<any>(updateUrl, updatedReport);
  }


  getReportByKey(key: string): Observable<any> {
    const url = `${this.apiUrl}/${key}`;
    return this.http.get<any>(url);
  }
  
}
