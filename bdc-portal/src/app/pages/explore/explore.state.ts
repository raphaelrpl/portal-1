import { Feature } from './sidenav/collection/collection.interface';
import { Layer, LatLngBoundsExpression } from 'leaflet';

/** State Model - used in Explore module */
export interface ExploreState {
    /** all selected features */
    readonly features: Feature[];
    /** selected features/items in the period */
    readonly featuresPeriod: Feature[];
    /** selected samples */
    readonly samples: object[];
    /** layers visible in the map */
    readonly layers: Layer[];
    /** list of layers to remove in the map */
    readonly layersToDisabled: string[];
    /** list of group layer to remove in the map */
    readonly layerGroupToDisabled: object;
    /** grid name displayed in the map */
    readonly grid: string;
    /** tiles with data in cube selected */
    readonly tiles: string[];
    /** bands of the selected cube */
    readonly bands: string[];
    /** bounding box of the map */
    readonly positionMap: LatLngBoundsExpression;
    /** range (start-end) with selected dates */
    readonly rangeTemporal: Date[];
    /** range (start-end) of the slider period */
    readonly actualRangeTemporal: Date[];
    /** selected bounding box */
    readonly bbox: LatLngBoundsExpression;
    /** opacity of the cube */
    readonly opacity: string;
    /** tempral schema of the cube */
    readonly tschema: string;
    /** temporal step of the cube */
    readonly tstep: number;
    /** status visible - loading component */
    readonly loading: boolean;
}
