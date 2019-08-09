import { createAction, props } from '@ngrx/store';
import { Feature } from './sidenav/collection/collection.interface';
import { Layer, LatLngBounds } from 'leaflet';

export const setFeatures = createAction(
    '[Explore Component] Features',
    props<Feature[]>()
);

export const setLayers = createAction(
    '[Map Component] Layers',
    props<Layer[]>()
);

export const setBands = createAction(
    '[Map Component] Bands',
    props<string[]>()
);

export const setPositionMap = createAction(
    '[Map Component] Position',
    props<LatLngBounds>()
);

export const setBbox = createAction(
    '[Map Component] Bounding Box',
    props<LatLngBounds>()
);

export const setRangeTemporal = createAction(
    '[Map Component] Range Temporal',
    props<Date[]>()
);

export const showLoading = createAction(
    '[Loading Component] showLoading'
);

export const closeLoading = createAction(
    '[Loading Component] closeLoading'
);