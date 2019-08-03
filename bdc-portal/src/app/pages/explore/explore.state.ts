import { Collection } from './sidenav/collection/collection.interface';
import { Layer, LatLngBoundsExpression, Map as MapLealet } from 'leaflet';

export interface ExploreState {
    readonly collections: Collection[];
    readonly layers: Layer[];
    readonly positionMap: LatLngBoundsExpression;
    readonly rangeTemporal: Date[];
    readonly bbox: LatLngBoundsExpression;
    readonly loading: boolean;
}