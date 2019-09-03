import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Service to get infos and features of catalog
 */
@Injectable({ providedIn: 'root' })
export class CatalogService {

    /** url base of stac compose */
    private urlStacCompose = window['__env'].urlStacCompose;

    /** start http service client */
    constructor(private http: HttpClient) { }

    /**
     * get All Providers
     */
    public async getProviders(): Promise<any> {
        const urlSuffix = `/providers`;
        const response = await this.http.get(`${this.urlStacCompose}${urlSuffix}`).toPromise();
        return response;
    }

    /**
     * get Collections by providers
     */
    public async getCollections(providers: string): Promise<any> {
        const urlSuffix = `/collections?providers=${providers}`;
        const response = await this.http.get(`${this.urlStacCompose}${urlSuffix}`).toPromise();
        return response;
    }

    /**
     * get Items by collections
     */
    public async getItems(query: string): Promise<any> {
        const urlSuffix = `/collections/items?${query}`;
        const response = await this.http.get(`${this.urlStacCompose}${urlSuffix}`).toPromise();
        return response;
    }
}
