import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, retry } from 'rxjs/operators';
import { HTTP_GENERAL_HEADERS } from 'src/app/classes/headers';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  headers = new HTTP_GENERAL_HEADERS();
  constructor(private http: HttpClient) { }

  GetSystems() {
    return this.http.get(environment.url + '/systems/all', this.headers.httpOptions).pipe(
      map((res: any) => {
        if (res.error) {
          return res;
        } else {
          return res;
        }
      }),
      retry(1)
    );
  }

  AddSystem(systemName: string) {
    return this.http.post(environment.url + '/systems/add', { systemName }, this.headers.httpOptions).pipe(
      map((res: any) => {
        if (res.error) {
          return res;
        } else {
          return res;
        }
      }),
      retry(1)
    );
  }

  GetDatabases(systemId: number) {
    return this.http.get(environment.url + '/systems/add', {
      headers: this.headers.httpOptions,
      params: {
        systemId: systemId.toString()
      }
    }).pipe(
      map((res: any) => {
        if (res.error) {
          return res;
        } else {
          return res;
        }
      }),
      retry(1)
    );
  }

}
