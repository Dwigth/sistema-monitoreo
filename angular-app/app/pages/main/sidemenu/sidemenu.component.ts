import { Component, OnInit } from '@angular/core';
import { InfoService } from 'src/app/services/info.service';
import { SidemenuService } from './sidemenu.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {

  constructor(public sidemenu: SidemenuService, public InfoServ: InfoService) { }

  ngOnInit(): void {
  }

  ResolveIssue(id) {
    if (confirm('¿Está seguro?')) {
      this.InfoServ.ResolveIssue(id).subscribe((r: any) => {
        alert(r.msg);
        this.sidemenu.CURRENT_SYSTEM.errors.splice(this.sidemenu.CURRENT_SYSTEM.errors.findIndex(e => e.id === id), 1);
      });
    }
  }

}
