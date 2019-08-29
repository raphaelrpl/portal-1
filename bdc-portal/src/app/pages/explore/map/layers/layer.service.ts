import { Injectable } from '@angular/core';
import { BdcLayer } from './layer.interface';
import { BaseLayers } from './base-layers.in-memory';
import { Grids } from './grids.in-memory';

/**
 * Layer Service
 * returns layers to visualization in the map
 */
@Injectable({ providedIn: 'root' })
export class LayerService {

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

}
