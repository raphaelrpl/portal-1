import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SearchService {

    private urlStac = window['__env'].urlStac
    private urlGeoserver = window['__env'].urlGeoserver

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

    /**
     * get Samples features in Geoserver by WFS
     */
    public getSamples(query: string): Promise<any> {
        let urlSuffix = `?service=WFS&version=1.0.0&request=GetFeature&typeName=sample:sample&outputFormat=application/json`;
        urlSuffix += `&${query}`;
        return this.http.get(`${this.urlGeoserver}/sample/ows${urlSuffix}`).toPromise();
    }
}
