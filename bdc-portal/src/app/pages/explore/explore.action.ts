import { createAction, props } from '@ngrx/store';
import { Feature } from './sidenav/collection/collection.interface';
import { Layer, LatLngBounds } from 'leaflet';

/**
 * set Features in store application
 */
export const setFeatures = createAction(
    '[Explore Component] Features',
    props<Feature[]>()
);

/**
 * set Features od the period (slider) in store application
 */
export const setFeaturesPeriod = createAction(
    '[Explore Component] Features By Period',
    props<Feature[]>()
);

/**
 * set Layers enabled in the map
 */
export const setLayers = createAction(
    '[Map Component] Layers',
    props<Layer[]>()
);

/**
 * set Features in store application
 */
export const setBands = createAction(
    '[Map Component] Bands',
    props<string[]>()
);

/**
 * set Opacity Cube in store application
 */
export const setOpacity = createAction(
    '[Map Component] Opacity Layer',
    props()
);

/**
 * set position of the map
 */
export const setPositionMap = createAction(
    '[Map Component] Position',
    props<LatLngBounds>()
);

/**
 * set Bounding Box selected in search form
 */
export const setBbox = createAction(
    '[Map Component] Bounding Box',
    props<LatLngBounds>()
);

/**
 * set Features in store application
 */
export const setRangeTemporal = createAction(
    '[Map Component] Range Temporal',
    props<Date[]>()
);

/** set loading as true */
export const showLoading = createAction(
    '[Loading Component] showLoading'
);

/** set loading as false */
export const closeLoading = createAction(
    '[Loading Component] closeLoading'
);
