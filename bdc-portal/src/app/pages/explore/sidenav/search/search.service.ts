import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SearchService {

    /** start http service client */
    constructor(private http: HttpClient) { }

    /**
     * get STAC providers in the BDC project
     */
    public async getProviders(): Promise<any> {
        const urlSuffix = '/search/providers';
        const response = await this.http.get(`${environment.urlStac}${urlSuffix}`).toPromise();
        return response;
    }

    /**
     * get Collections in STAC Search
     */
    public async searchCollections(query: string): Promise<any> {
        const urlSuffix = `/search/?${query}`;
        const response = await this.http.get(`${environment.urlStac}${urlSuffix}`).toPromise();
        return response;
    }
}
