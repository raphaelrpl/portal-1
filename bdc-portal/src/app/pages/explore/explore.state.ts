import { Collection } from './sidenav/collection/collection.interface';
import { Layer, LatLngBoundsExpression } from 'leaflet';

export interface ExploreState {
    readonly collections: Collection[];
    readonly layers: Layer[];
    readonly positionMap: LatLngBoundsExpression;
    readonly loading: boolean;
}