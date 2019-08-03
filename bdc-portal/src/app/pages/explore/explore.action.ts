import { createAction, props } from '@ngrx/store';
import { Collection } from './sidenav/collection/collection.interface';
import { Layer, LatLngBounds } from 'leaflet';

export const setCollections = createAction(
    '[Explore Component] Collections',
    props<Collection[]>()
);

export const setLayers = createAction(
    '[Map Component] Layers',
    props<Layer[]>()
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