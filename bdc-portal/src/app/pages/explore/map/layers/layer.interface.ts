import { Layer } from 'leaflet';

export interface Layer {
    id: string;
    name: string;
    enabled: boolean;
    layer: Layer;
}

export interface LayerId {
    ds: string,
    title: string,
    name: string,
    enabled: boolean
}
