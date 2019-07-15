import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BdcLayerWFS, BdcLayer } from './layer.interface';
import { BaseLayers } from './baseLayers.in-memory';
import { Grids } from './grids.in-memory';

/**
 * Layer Service
 * returns layers to visualization in the map
 */
@Injectable({ providedIn: 'root' })
export class LayerService {

    /** base URL of the Geoserver from the BDC project */
    private geoserverUrl = 'http://cbers1.dpi.inpe.br:8095/geoserver/<ds>/ows';

    /** start http service client */
    constructor(private http: HttpClient) { }

    /**
     * get base layers of the map
     * @returns list of BDC layer
     */
    public getBaseLayers(): BdcLayer[] {
        return BaseLayers;
    }

    /**
     * get grids of the BDC project
     * @returns list of WFS BDC layers
     */
    public getGridsLayers(): BdcLayerWFS[] {
        return Grids;
    }

    /**
     * gets GeoJson object from a layer in the Geoserver of the BDC project
     * @params {string} datastore
     * @params {string} layer title
     * @returns layer GeoJson (Promise)
     */
    public async getGeoJsonByLayer(ds: string, title: string): Promise<any> {
        const url = `${this.geoserverUrl.replace('<ds>', ds)}?
            service=WFS&version=1.0.0&request=GetFeature&typeName=${ds}:${title}&&outputFormat=application%2Fjson`;
        const response = await this.http.get(url).toPromise();
        return response;
    }

}
