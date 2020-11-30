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

  totalErroresWebsites = [];
  totalErroresDatabases = [];
  totalErroresWebservices = [];

  WebServicesOutOfService = false;
  WebServicesDown = false;

  DatabasesOutOfService = false;
  DatabasesDown = false;

  constructor() { }

  @Input() MonitoredApplication: IMonitoredApplication;

  ngOnInit(): void {
    moment.locale('es')
    this.timeDiff = moment(this.MonitoredApplication.upDate).fromNow();
    this.totalErroresWebsites = this.CodeStatusChecker(this.MonitoredApplication.websites);
    this.totalErroresWebservices = this.CodeStatusChecker(this.MonitoredApplication.webservices);

    this.totalErroresDatabases = this.CodeStatusChecker(this.MonitoredApplication.databases);


    setTimeout(() => {
      this.ChangeDBColors();
      this.ChangeWSColors();
      this.ChangeCardColors();
    }, 100);
  }

  /**
   * 
   * @param arr El primer elemento del arreglo representa el total de elementos, el segundo representa cuantos tienen inconsistencias
   * y el tercero cuantos están fuera de servicio.
   */
  CodeStatusChecker(arr: any[]) {
    let length = arr.length;
    let totalinconsistency = 0;
    let totaloutofservice = 0;
    arr.forEach(arrElem => {
      if (arrElem.statusResponseCode >= 400) {
        totaloutofservice++;
      }
      if (arrElem.statusResponseCode >= 201) {
        totalinconsistency++;
      }
    });
    // Todas están fuera de servicio por ende
    if (totaloutofservice === length) {
      totalinconsistency = 0;
    }
    return [length, totalinconsistency, totaloutofservice];
  }

  ChangeCardColors() {
    const card = document.getElementById('card-' + this.MonitoredApplication.id);
    const cardDot = document.getElementById('card-dot-' + this.MonitoredApplication.id);

    const dbIcon = document.getElementById(this.MonitoredApplication.id + '-db');
    const dbIconDot = document.getElementById('db-dot-' + this.MonitoredApplication.id);

    const wsIcon = document.getElementById(this.MonitoredApplication.id + '-cloud');
    const wsIconDot = document.getElementById('ws-dot-' + this.MonitoredApplication.id);

    if (card) {

      // Si hay algún error en el arreglo de errores a primera instancia cambiamos el color a
      // amarillo o "inconsistencia"

      if (this.MonitoredApplication.errors.length > 0) {
        card.classList.toggle('border-inconsistency');
        cardDot.classList.toggle('inconsistency');
        console.log('Debería pintarse en amarillo');
      }

      if (this.DatabasesDown) {
        dbIconDot.classList.toggle('inconsistency');
      }
      if (this.WebServicesDown) {
        wsIconDot.classList.toggle('inconsistency');
      }
      if (this.DatabasesOutOfService) {
        dbIconDot.classList.toggle('out-of-service');
      }
      if (this.WebServicesOutOfService) {
        wsIconDot.classList.toggle('out-of-service');
      }

      if (this.DatabasesOutOfService && this.WebServicesOutOfService) {
        card.classList.toggle('border-out-of-service');
        cardDot.classList.toggle('out-of-service');
      }



    }
  }

  ChangeDBColors() {
    const tedb = this.totalErroresDatabases;
    if (tedb[1] === tedb[0]) {
      this.DatabasesDown = true;
    }
    if (tedb[2] === tedb[0]) {
      this.DatabasesOutOfService = true;
    }
  }

  ChangeWSColors() {
    const tews = this.totalErroresWebsites;
    const tewss = this.totalErroresWebservices;
    if (tews[1] === tews[0] || tewss[1] === tewss[0]) {
      this.WebServicesDown = true;
    }
    if (tews[2] === tews[0] || tewss[2] === tewss[0]) {
      this.WebServicesOutOfService = true;
    }
  }
}
