import { createReducer, on } from '@ngrx/store';
import {
  setLayers,
  setBbox,
  setPositionMap,
  setRangeTemporal,
  setFeatures,
  setBands,
  setFeaturesPeriod,
  setGrid,
  setTSchema,
  setTStep,
  setSamples,
  removeLayers,
  removeGroupLayer,
  setActualRangeTemporal,
  setEditFeature
} from './explore.action';
import { ExploreState } from './explore.state';

/** initial values to Explore State */
const initialState: ExploreState = {
  features: [],
  featuresPeriod: [],
  samples: [],
  layers: [],
  layersToDisabled: [],
  layerGroupToDisabled: [],
  bands: [],
  grid: '',
  tiles: [],
  positionMap: null,
  loading: false,
  bbox: null,
  tschema: '',
  tstep: 0,
  rangeTemporal: [],
  actualRangeTemporal: [],
  featureEdit: {}
};

/**
 * reducer to manage explore state
 * set new values in ExploreState
 */
export const reducer = createReducer(initialState,
  on(setFeatures, (state, payload) => {
    return { ...state, features: payload };
  }),
  on(setFeaturesPeriod, (state, payload) => {
    return { ...state, featuresPeriod: payload };
  }),
  on(setSamples, (state, payload) => {
    return { ...state, samples: payload };
  }),
  on(setLayers, (state, payload) => {
    return { ...state, layers: payload };
  }),
  on(removeLayers, (state, payload) => {
    return { ...state, layersToDisabled: payload };
  }),
  on(removeGroupLayer, (state, payload) => {
    return { ...state, layerGroupToDisabled: payload };
  }),
  on(setBands, (state, payload) => {
    return { ...state, bands: payload };
  }),
  on(setGrid, (state, payload) => {
    return { ...state, grid: payload['grid'].toString(), tiles: payload['tiles'] };
  }),
  on(setPositionMap, (state, payload) => {
    return { ...state, positionMap: payload };
  }),
  on(setRangeTemporal, (state, payload) => {
    return { ...state, rangeTemporal: payload };
  }),
  on(setActualRangeTemporal, (state, payload) => {
    return { ...state, actualRangeTemporal: payload };
  }),
  on(setBbox, (state, payload) => {
    return { ...state, bbox: payload };
  }),
  on(setTSchema, (state, payload) => {
    return { ...state, tschema: payload['tschema'].toString() };
  }),
  on(setTStep, (state, payload) => {
    return { ...state, tstep: parseInt(payload['tstep']) };
  }),
  on(setEditFeature, (state, payload) => {
    return { ...state, featureEdit: payload };
  })
);
