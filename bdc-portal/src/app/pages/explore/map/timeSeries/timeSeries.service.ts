import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

/**
 * Time Series Service
 * search array with time series
 */
@Injectable({ providedIn: 'root' })
export class TimeSeriesService {

    /** start http service client */
    constructor(private http: HttpClient) { }

    /**
     * get Time Series
     * @returns promise with array of the time series separing by band
     */
    public async getTimeSeriesWTSS(query): Promise<any> {
        const urlSuffix = `/time_series${query}`;
        const response = await this.http.get(`${environment.urlWTSS}${urlSuffix}`).toPromise();
        return response;
    }
}
