import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IMonitoredWebservice } from 'src/app/interfaces/core';
import { ConfigService } from 'src/app/modulos/config/config-service.service';
import { COPY } from 'src/app/classes/helpers';
@Component({
  selector: 'app-ws-table',
  templateUrl: './ws-table.component.html',
  styleUrls: ['./ws-table.component.scss']
})
export class WsTableComponent implements OnInit {

  private sub: Subscription;
  private systemId:number;
  public Webservices:IMonitoredWebservice[];
  constructor(
    private route: ActivatedRoute, 
    private configS:ConfigService,
    private router:Router) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.systemId = +params['systemId'];
      if(this.systemId) {
        this.configS.GetWebservices(this.systemId).subscribe(data => this.Webservices = data.data)
      } else {
        this.configS.GetWebservices().subscribe(data => this.Webservices = data.data)
      }
   });
 }

 ngOnDestroy() {
   this.sub.unsubscribe();
 }

 addToken() {
   this.router.navigate(['/config/index/webservices/add'],{queryParams:{
     state:0
   }})
 }

 copy(token) {
  COPY(token);
 }

}
