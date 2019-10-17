import { Injectable } from '@angular/core';
import { BdcLayer } from './layer.interface';
import { BaseLayers } from './base-layers.in-memory';
import { Grids } from './grids.in-memory';
import { HttpClient } from '@angular/common/http';

/**
 * Layer Service
 * returns layers to visualization in the map
 */
@Injectable({ providedIn: 'root' })
export class LayerService {

    /** start http service client */
    constructor(private http: HttpClient) { }

    /** base url of GEOSERVER */
    private urlGeoserver = window['__env'].urlGeoserver;

    /**
     * get base layers of the map
     */
    public getBaseLayers(): BdcLayer[] {
        return BaseLayers;
    }

    /**
     * get grids of the BDC project
     */
    public getGridsLayers(): BdcLayer[] {
        return Grids;
    }

    /**
     * get info feature WMS
     */
    public async getInfoByWMS(layer, bbox, x, y, height, width): Promise<any> {
        const basePath = '/grids/wms?REQUEST=GetFeatureInfo&SERVICE=WMS&SRS=EPSG:4326&VERSION=1.1.1';
        let urlSuffix = `${basePath}&BBOX=${bbox}&HEIGHT=${height}&WIDTH=${width}`;
        urlSuffix += `&LAYERS=grids:${layer}&QUERY_LAYERS=grids:${layer}&INFO_FORMAT=application/json&X=${x}&Y=${y}`;

        const response = await this.http.get(`${this.urlGeoserver}${urlSuffix}`).toPromise();
        return response;
    }

}
