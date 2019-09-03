import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private urlOauth = window['__env'].urlOauth;

    /** start http service client */
    constructor(private http: HttpClient) { }

    /**
     * login in DPI Oauth
     */
    public async login(credentials: object): Promise<any> {
        const urlSuffix = `/auth/login`;
        const response = await this.http.post(`${this.urlOauth}${urlSuffix}`, credentials).toPromise();
        return response;
    }
}
