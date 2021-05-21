import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor() { }

  systemPages = [
    {name:'Sistemas', route:'systems'},
    {name:'Servicios Web', route:'webservices'},
    {name:'Bases de datos', route:'databases'},
    {name:'Páginas web', route:'websites'},
  ];
  
  configPages = [
    {name:'Historial de errores', route:'error-history'},
    {name:'Notificaciones', route:'notifications'},
  ];

  ngOnInit(): void {
  }

}
