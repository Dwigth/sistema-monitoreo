import { HttpHeaders } from '@angular/common/http';

/**
 * 
 */
export class HTTP_GENERAL_HEADERS {
    httpOptions = {} as any;
    httpFilesOptions = {} as any;
    token = localStorage.getItem('token');

    constructor() {
        this.setOptions();
    }

    Token(token: string): void {
        this.token = token;
        this.setOptions();
    }

    private setOptions(): void {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.token
            })
        };
        this.httpFilesOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.token
            })
        }
    }
}

export const httpOptions = {

    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
    })
};

export const httpFilesOptions = {
    headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
    })
};
