import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BdcLayersWFS, BdcLayersWMS } from './layer.interface';
import { BaseLayers } from './wmsLayers.in-memory';
import { Grids } from './wfsLayers.in-memory';

@Injectable({ providedIn: 'root' })
export class LayerService {

    private geoserverUrl = 'http://cbers1.dpi.inpe.br:8095/geoserver/<ds>/ows';

    constructor(private http: HttpClient) { }

    /**
     * getBaseLayers
     */
    public getBaseLayers(): BdcLayersWMS[] {
        return BaseLayers;
    }

    /**
     * getGrids
     */
    public getGridsLayers(): BdcLayersWFS[] {
        return Grids;
    }

    /**
     * getGeoJsonByLayer
     */
    public async getGeoJsonByLayer(ds: string, title: string): Promise<any> {
        const url = `${this.geoserverUrl.replace('<ds>', ds)}?
            service=WFS&version=1.0.0&request=GetFeature&typeName=${ds}:${title}&&outputFormat=application%2Fjson`;
        const response = await this.http.get(url).toPromise();
        return response;
    }

}
