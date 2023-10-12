import { Injectable } from '@angular/core';
import { IMonitoredApplication } from 'src/app/interfaces/core';

@Injectable({
  providedIn: 'root'
})
export class SidemenuService {

  CURRENT_SYSTEM: IMonitoredApplication;

  constructor() { }

  set system(sys) {
    this.CURRENT_SYSTEM = sys;
  }

  /* Set the width of the side navigation to 250px */
  openNav() {
    document.getElementById("mySidenav").style.width = "650px";
  }

  /* Set the width of the side navigation to 0 */
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }
}
