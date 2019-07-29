import { Collection } from './sidenav/collection/collection.interface';
import { Layer } from 'leaflet';

export interface ExploreState {
    readonly collections: Collection[];
    readonly layers: Layer[];
    readonly loading: boolean;
}