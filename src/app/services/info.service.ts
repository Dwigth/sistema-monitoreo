import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor(private socket: Socket, private http: HttpClient) { }

  getWebsitesInfo() {
    return this.socket
      .fromEvent("websites-info")
      .pipe(map((data) => data));
  }

  ResolveIssue(id: number) {
    return this.http.delete(environment.url + '/resolve/issue/' + id, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(map((data) => data))
  }
}
