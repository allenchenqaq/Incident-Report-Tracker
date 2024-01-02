import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportService } from '../report.service';
import md5 from 'md5';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.css']
})
export class ReportViewComponent implements OnInit {
  report: any; //report?
  key: string='';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private rs: ReportService,
    private appComponent: AppComponent
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (history.state && history.state.report) {
        //added
        this.report = history.state.report;
      }
    });
  }

  goBack(): void {
    this.router.navigate([""]);
  }

  onChangeStatus(): void {
    const enteredPassword = prompt('Enter the password for status change:', ''); 
    if (enteredPassword === null) {
      console.error('Password entry cancelled');
      return;
    }

    const hashedPassword = md5(enteredPassword);
    const validHash = 'fcab0453879a2b2281bc5073e3f5fe54';
  
    if (hashedPassword !== validHash) {
      alert('Invalid password');
      console.error('Invalid password');
      return;
    }

    const updatedStatus = 'RESOLVED';
    const updatedReport = { ...this.report };
    updatedReport.data.status = updatedStatus;
    

    this.rs.updateReport(this.report.key, updatedReport).subscribe({
      next: (response) => {
        console.log('Report updated with new status:', response);
        window.location.reload() 
        // this.goBack()
        // added        
      },
      error: (error) => {
        console.error('Error updating report:', error);
      }
    });
  }
}
