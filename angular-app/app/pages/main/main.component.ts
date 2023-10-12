import { Component, OnInit } from '@angular/core';
import { SnackbarService } from 'ngx-snackbar';
import { IMonitoredApplication } from 'src/app/interfaces/core';
import { InfoService } from 'src/app/services/info.service';
import { Systems } from 'src/app/systems';
import { SidemenuService } from './sidemenu/sidemenu.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  System: Systems = new Systems();
  systems: IMonitoredApplication[];

  constructor(public infoS: InfoService, public sidemenu: SidemenuService, private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.systems = this.System.Systems;
    this.infoS.getWebsitesInfo().subscribe((r: { responses: IMonitoredApplication[], lastUpdate: string }) => {
      this.systems = r.responses;
      this.System.newSystems = this.systems;

      const _this = this;
      this.snackbarService.add({
        msg: `<strong>${r.lastUpdate}</strong>`,
        timeout: 5000,
        action: {
          text: 'Ok',
          onClick: (snack) => {
            // console.log('dismissed: ' + snack.id);
          },
        },
        onAdd: (snack) => {
          // console.log('added: ' + snack.id);
        },
        onRemove: (snack) => {
          // console.log('removed: ' + snack.id);
        }
      });
    });
  }

}
