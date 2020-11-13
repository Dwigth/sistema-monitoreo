import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import { IMonitoredApplication } from 'src/app/interfaces/core';

@Component({
  selector: 'app-system-info',
  templateUrl: './system-info.component.html',
  styleUrls: ['./system-info.component.scss']
})
export class SystemInfoComponent implements OnInit {

  timeDiff: string;

  constructor() { }

  @Input() MonitoredApplication: IMonitoredApplication;

  ngOnInit(): void {
    console.log(this.MonitoredApplication);
    moment.locale('es')
    this.timeDiff = moment(this.MonitoredApplication.upDate).fromNow();
  }

}
