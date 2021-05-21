import { Component, OnInit } from '@angular/core';
import { IMonitoredApplication } from 'src/app/interfaces/core';
import { ConfigService } from 'src/app/modulos/config/config-service.service';

@Component({
  selector: 'app-system-table',
  templateUrl: './system-table.component.html',
  styleUrls: ['./system-table.component.scss']
})
export class SystemTableComponent implements OnInit {

  LocalMonitoredSystems: IMonitoredApplication[];
  MonitoredSystems: IMonitoredApplication[];

  constructor(private configS:ConfigService) { }

  ngOnInit(): void {
    this.LocalMonitoredSystems = Array.from(JSON.parse(localStorage.getItem('systems')));
    this.configS.GetSystems().subscribe((data:IMonitoredApplication[]) => this.MonitoredSystems = data);
  }
}
