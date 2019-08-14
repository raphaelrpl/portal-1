import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SearchService {

    /** start http service client */
    constructor(private http: HttpClient) { }

    /**
     * get All Collections
     * @returns promise with collections list
     */
    public async getCollections(): Promise<any> {
        const urlSuffix = `/collections`;
        const response = await this.http.get(`${environment.urlStac}${urlSuffix}`).toPromise();
        return response;
    }

    /**
     * get Collection by name
     * @params {string} collection name
     * @returns promise with collection infos
     */
    public async getCollectionByName(collection: string): Promise<any> {
        const urlSuffix = `/collections/${collection}`;
        const response = await this.http.get(`${environment.urlStac}${urlSuffix}`).toPromise();
        return response;
    }

    /**
     * get Features in STAC Search
     * @params {string} query with params to stac search
     * @returns promise with features list
     */
    public async searchSTAC(query: string): Promise<any> {
        const urlSuffix = `/stac/search?${query}`;
        const response = await this.http.get(`${environment.urlStac}${urlSuffix}`).toPromise();
        return response;
    }
}
