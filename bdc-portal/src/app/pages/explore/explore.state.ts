import { Feature } from './sidenav/collection/collection.interface';
import { Layer, LatLngBoundsExpression } from 'leaflet';

export interface ExploreState {
    readonly features: Feature[];
    readonly featuresPeriod: Feature[];
    readonly layers: Layer[];
    readonly bands: string[];
    readonly positionMap: LatLngBoundsExpression;
    readonly rangeTemporal: Date[];
    readonly bbox: LatLngBoundsExpression;
    readonly opacity: string;
    readonly loading: boolean;
}
