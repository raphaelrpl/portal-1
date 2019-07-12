import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 
@Injectable({ providedIn: 'root' })
export class LayerService {
 
    private geoserverUrl: string = 'http://cbers1.dpi.inpe.br:8095/geoserver/<ds>/ows';
    
    constructor(private http: HttpClient) { }
 
    public async getLayerGeoJson (ds: string, title: string): Promise<Object> {
        let url = `${this.geoserverUrl.replace('<ds>', ds)}?service=WFS&version=1.0.0&request=GetFeature&typeName=${ds}:${title}&&outputFormat=application%2Fjson`;
        const response = await this.http.get(url).toPromise();
        return response;
    }

}