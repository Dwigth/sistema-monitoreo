import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidemenuService {

  CURRENT_SYSTEM;

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
