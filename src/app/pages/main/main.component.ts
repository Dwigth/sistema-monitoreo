import { Component, OnInit } from '@angular/core';
import { InfoService } from 'src/app/services/info.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(public infoS: InfoService) { }

  ngOnInit(): void {
    this.infoS.getWebsitesInfo().subscribe(r => console.log(r))
  }

}
