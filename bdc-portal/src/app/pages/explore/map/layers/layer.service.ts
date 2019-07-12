import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 
import { GeoJsonObject } from 'geojson';
 
@Injectable({ providedIn: 'root' })
export class LayerService {
 
    private geoserverUrl: string = 'http://cbers1.dpi.inpe.br:8095/geoserver/<ds>/ows';
    
    constructor(private http: HttpClient) { }
 
    /** GET heroes from the server */
    getLayerGeoJson (ds: string, title: string): any {
        let url = `${this.geoserverUrl.replace('<ds>', ds)}?service=WFS&version=1.0.0&request=GetFeature&typeName=${ds}:${title}&&outputFormat=application%2Fjson`;
        return this.http.get(url).toPromise().then((response: any) => response);
    }

}