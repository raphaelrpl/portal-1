import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Service to get infos and features of catalog
 */
@Injectable({ providedIn: 'root' })
export class CubesService {

    /** url base of stac compose */
    private urlSoloist = window['__env'].urlSoloist;
    private urlMaestro = window['__env'].urlMaestro;
    private urlDataSearchINPE = window['__env'].urlDataSearchINPE;

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

    /**
     * get datasets available to create cubes
     * (satellite / sensor)
     */
    public async getDatasets() {
        const response = await this.http.get(`${this.urlDataSearchINPE}`, {responseType: 'text'}).toPromise();
        return response;
    }

    /**
     * get grids available to create cubes
     * (GRS)
     */
    public async getGrids() {
        const urlSuffix = `/wrsinfo`;
        const response = await this.http.get(`${this.urlSoloist}${urlSuffix}`).toPromise();
        return response;
    }

    /**
     * create Cube (set metadata of cube)
     */
    public async create(query: string) {
        const urlSuffix = `/create?${query}`;
        const response = await this.http.get(`${this.urlSoloist}${urlSuffix}`).toPromise();
        return response;
    }

    /**
     * start process to creating cube
     */
    public async start(query: string) {
        const urlSuffix = `/process?${query}`;
        const response = await this.http.get(`${this.urlMaestro}${urlSuffix}`).toPromise();
        return response;
    }
}