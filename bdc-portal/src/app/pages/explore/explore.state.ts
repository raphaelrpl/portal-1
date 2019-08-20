import { Feature } from './sidenav/collection/collection.interface';
import { Layer, LatLngBoundsExpression } from 'leaflet';

/** State Model - used in Explore module */
export interface ExploreState {
    /** all selected features */
    readonly features: Feature[];
    /** selected features/items in the period */
    readonly featuresPeriod: Feature[];
    /** layers visible in the map */
    readonly layers: Layer[];
    /** bands of the selected cube */
    readonly bands: string[];
    /** bounding box of the map */
    readonly positionMap: LatLngBoundsExpression;
    /** range (start-end) with selected dates */
    readonly rangeTemporal: Date[];
    /** selected bounding box */
    readonly bbox: LatLngBoundsExpression;
    /** opacity of the cube */
    readonly opacity: string;
    /** status visible - loading component */
    readonly loading: boolean;
}
