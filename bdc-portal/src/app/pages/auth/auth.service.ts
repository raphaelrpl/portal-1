import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Service to authentication
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

    /** base url of Oauth */
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

    /**
     * get Token in DPI Oauth
     */
    public async token(scope: string, service?: string): Promise<any> {
        const urlSuffix = `/auth/token?service=${service || window['__env'].appName}&scope=${scope}`;
        const authenticationToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))['token'] : '';
        const response = await this.http.get(`${this.urlOauth}${urlSuffix}`, {
            headers: {
                Authorization: `Bearer ${authenticationToken}`
            }
        }).toPromise();
        return response;
    }
}
