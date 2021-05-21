import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IMonitoredWebsite } from 'src/app/interfaces/core';
import { ConfigService } from 'src/app/modulos/config/config-service.service';

@Component({
  selector: 'app-w-table',
  templateUrl: './w-table.component.html',
  styleUrls: ['./w-table.component.scss']
})
export class WTableComponent implements OnInit {

  private sub: Subscription;
  private systemId:number;
  public Websites:IMonitoredWebsite[];
  constructor(private route: ActivatedRoute, private configS:ConfigService) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.systemId = +params['systemId'];
      if(this.systemId) {
        this.configS.GetWebsites(this.systemId).subscribe(data => this.Websites = data.data)
      } else {
        this.configS.GetWebsites().subscribe(data => this.Websites = data.data)
      }
   });
 }

 ngOnDestroy() {
   this.sub.unsubscribe();
 }

}
