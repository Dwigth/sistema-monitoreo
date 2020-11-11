import { Component, OnInit } from '@angular/core';
import { IMonitoredApplication } from 'src/app/interfaces/core';
import { InfoService } from 'src/app/services/info.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  systems:IMonitoredApplication[];

  constructor(public infoS: InfoService) { }

  ngOnInit(): void {
    this.infoS.getWebsitesInfo().subscribe((r:{responses:IMonitoredApplication[]}) => {
      this.systems = r.responses;
    });
  }

}
