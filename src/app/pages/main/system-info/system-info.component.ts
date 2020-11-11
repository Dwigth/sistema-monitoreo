import { Component, Input, OnInit } from '@angular/core';
import { IMonitoredApplication } from 'src/app/interfaces/core';

@Component({
  selector: 'app-system-info',
  templateUrl: './system-info.component.html',
  styleUrls: ['./system-info.component.scss']
})
export class SystemInfoComponent implements OnInit {

  constructor() { }

  @Input() MonitoredApplication:IMonitoredApplication;

  ngOnInit(): void {
    console.log(this.MonitoredApplication);
    
  }

}
