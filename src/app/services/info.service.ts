import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor(private socket: Socket) { }

  getWebsitesInfo() {
    return this.socket
      .fromEvent("websites-info")
      .pipe(map((data) => data));
  }
}
