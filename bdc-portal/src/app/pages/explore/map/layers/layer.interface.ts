import { Layer } from 'leaflet';

export interface BdcLayersWMS {
    id: string;
    name: string;
    enabled: boolean;
    layer: Layer;
}

export interface BdcLayersWFS {
    ds: string;
    title: string;
    name: string;
    enabled: boolean;
}
