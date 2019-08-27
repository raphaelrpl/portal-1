import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SearchService {

    private urlStac = window['__env'].urlStac

    /** start http service client */
    constructor(private http: HttpClient) { }

    /**
     * get All Collections
     * @returns promise with collections list
     */
    public async getCollections(): Promise<any> {
        const urlSuffix = `/collections`;
        const response = await this.http.get(`${this.urlStac}${urlSuffix}`).toPromise();
        return response;
    }

    /**
     * get Collection by name
     */
    public async getCollectionByName(collection: string): Promise<any> {
        const urlSuffix = `/collections/${collection}`;
        const response = await this.http.get(`${this.urlStac}${urlSuffix}`).toPromise();
        return response;
    }

    /**
     * get Features in STAC Search
     */
    public async searchSTAC(query: string): Promise<any> {
        const urlSuffix = `/stac/search?${query}`;
        const response = await this.http.get(`${this.urlStac}${urlSuffix}`).toPromise();
        return response;
    }
}
