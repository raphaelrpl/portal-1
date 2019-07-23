import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BdcLayerWFS, BdcLayer } from './layer.interface';
import { BaseLayers } from './base-layers.in-memory';
import { Grids } from './grids.in-memory';

/**
 * Layer Service
 * returns layers to visualization in the map
 */
@Injectable({ providedIn: 'root' })
export class LayerService {

    /** base URL of the Geoserver from the BDC project */
    private geoserverUrl = 'http://brazildatacube.dpi.inpe.br/geoserver/<ds>/ows';
    /** base URL of the Soilist Service from the BDC project */
    private soilistUrl = 'http://cbers1.dpi.inpe.br:5021';

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
     * get tiles with data in the BDC project
     */
    public async getTilesUsed(): Promise<any> {
        const urlSuffix = '/tiles';
        const response = await this.http.get(`${this.soilistUrl}${urlSuffix}`).toPromise();
        return response;
    }

    /**
     * gets GeoJson object from a layer in the Geoserver of the BDC project
     * @params {string} datastore
     * @params {string} layer title
     * @returns layer GeoJson
     */
    public getGeoJsonByLayer(ds: string, title: string): Promise<any> {
        const urlSuffix = `?service=WFS&version=1.0.0&request=GetFeature&typeName=${ds}:${title}&&outputFormat=application%2Fjson`;
        return this.http.get(`${this.geoserverUrl.replace('<ds>', ds)}${urlSuffix}`).toPromise();
    }

}
