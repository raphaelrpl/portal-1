import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Time Series Service
 * search array with time series
 */
@Injectable({ providedIn: 'root' })
export class TimeSeriesService {

    /** url base of Geoserver */
    private urlWTSS = window['__env'].urlWTSS;

    /** start http service client */
    constructor(private http: HttpClient) { }

    /**
     * get Time Series
     * @returns promise with array of the time series separing by band
     */
    public async getTimeSeriesWTSS(query): Promise<any> {
        const urlSuffix = `/time_series${query}`;
        const response = await this.http.get(`${this.urlWTSS}${urlSuffix}`).toPromise();
        return response;
    }
}
