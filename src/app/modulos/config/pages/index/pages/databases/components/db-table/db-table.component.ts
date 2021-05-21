import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IMonitoredDatabase } from 'src/app/interfaces/core';
import { ConfigService } from 'src/app/modulos/config/config-service.service';
@Component({
  selector: 'app-db-table',
  templateUrl: './db-table.component.html',
  styleUrls: ['./db-table.component.scss']
})
export class DbTableComponent implements OnInit {
  private sub: Subscription;
  private systemId:number;
  public Databases:IMonitoredDatabase[];
  constructor(private route: ActivatedRoute, private configS:ConfigService) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.systemId = +params['systemId'];
      if(this.systemId) {
        this.configS.GetDatabases(this.systemId).subscribe(data => this.Databases = data.data)
      } else {
        this.configS.GetDatabases().subscribe(data => this.Databases = data.data)
      }
   });
 }

 ngOnDestroy() {
   this.sub.unsubscribe();
 }
}
