import { Layer } from 'leaflet';

/**
 * Language
 * interface of each layer
 */
export interface BdcLayer {
    /** id (unique) to layer identification */
    id: string;
    /** layer name shown in the component */
    name: string;
    /** layer state (visible/invisible) */
    enabled: boolean;
    /** tileLayer in leaflet */
    layer: Layer;
}