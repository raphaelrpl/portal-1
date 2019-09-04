import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Service to get infos and features of catalog
 */
@Injectable({ providedIn: 'root' })
export class CubesService {

    /** url base of stac compose */
    private urlSoloist = window['__env'].urlSoloist;

    /** start http service client */
    constructor(private http: HttpClient) { }

    /**
     * get All Cubes
     */
    public async getCubes(): Promise<any> {
        const urlSuffix = `/cubeinfo`;
        const response = await this.http.get(`${this.urlSoloist}${urlSuffix}`).toPromise();
        return response;
    }

    /**
     * get Status Process by Cube
     */
    public async getProcessByCube(cubeName: string): Promise<any> {
        const urlSuffix = `/cubestatus?cubename=${cubeName}`;
        const response = await this.http.get(`${this.urlSoloist}${urlSuffix}`).toPromise();
        return response;
    }
}
