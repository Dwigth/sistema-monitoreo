import { Component, OnInit } from '@angular/core';
import { IMonitoredApplication } from 'src/app/interfaces/core';
import { InfoService } from 'src/app/services/info.service';
import { Systems } from 'src/app/systems';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  System: Systems = new Systems();
  systems: IMonitoredApplication[];

  constructor(public infoS: InfoService) { }

  ngOnInit(): void {
    this.systems = this.System.Systems;
    this.infoS.getWebsitesInfo().subscribe((r: { responses: IMonitoredApplication[] }) => {
      this.systems = r.responses;
      this.System.newSystems = this.systems;
    });
  }

}
