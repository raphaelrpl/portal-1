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
 * set Samples in store application
 */
export const setSamples = createAction(
    '[Explore Component] Samples',
    props<object[]>()
);

/**
 * set Layers enabled in the map
 */
export const setLayers = createAction(
    '[Map Component] Layers',
    props<Layer[]>()
);

/**
 * remove Layers enabled in the map
 */
export const removeLayers = createAction(
    '[Map Component] name Layers',
    props<string[]>()
);

/**
 * remove Layers group enabled in the map
 */
export const removeGroupLayer = createAction(
    '[Map Component] name group layer',
    props<object>()
);

/**
 * set Grid enabled in the map
 */
export const setGrid = createAction(
    '[Map Component] Grid',
    props()
);

/**
 * set Features in store application
 */
export const setBands = createAction(
    '[Map Component] Bands',
    props<string[]>()
);

/**
 * set temporal schema of the Cube in store application
 */
export const setTSchema = createAction(
    '[Map Component] Temporal Schema',
    props()
);

/**
 * set temporal step of the Cube in store application
 */
export const setTStep = createAction(
    '[Map Component] Temporal Step',
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
 * set Dates filtered in store application
 */
export const setRangeTemporal = createAction(
    '[Map Component] Range Temporal',
    props<Date[]>()
);

/**
 * set Dates actual step filtered in store application
 */
export const setActualRangeTemporal = createAction(
    '[Map Component] Range Actual Temporal',
    props<Date[]>()
);

/**
 * set Feature to Edit
 */
export const setEditFeature = createAction(
    '[Map Component] Editable Feature',
    props<object>()
);
