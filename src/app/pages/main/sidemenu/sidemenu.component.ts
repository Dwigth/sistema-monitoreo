import { Component, OnInit } from '@angular/core';
import { SidemenuService } from './sidemenu.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {

  constructor(public sidemenu: SidemenuService) { }

  ngOnInit(): void {
  }

}
