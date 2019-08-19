import { createReducer, on } from '@ngrx/store';
import {
  showLoading,
  closeLoading,
  setLayers,
  setBbox,
  setPositionMap,
  setRangeTemporal,
  setFeatures,
  setBands,
  setFeaturesPeriod,
  setOpacity
} from './explore.action';
import { ExploreState } from './explore.state';

const initialState: ExploreState = {
  features: [],
  featuresPeriod: [],
  layers: [],
  bands: [],
  positionMap: null,
  loading: false,
  bbox: null,
  rangeTemporal: [],
  opacity: '1'
};

export const reducer = createReducer(initialState,
  on(setFeatures, (state, payload) => {
    return { ...state, features: payload };
  }),
  on(setFeaturesPeriod, (state, payload) => {
    return { ...state, featuresPeriod: payload };
  }),
  on(setLayers, (state, payload) => {
    return { ...state, layers: payload };
  }),
  on(setBands, (state, payload) => {
    return { ...state, bands: payload };
  }),
  on(setPositionMap, (state, payload) => {
    return { ...state, positionMap: payload };
  }),
  on(setRangeTemporal, (state, payload) => {
    return { ...state, rangeTemporal: payload };
  }),
  on(setBbox, (state, payload) => {
    return { ...state, bbox: payload };
  }),
  on(setOpacity, (state, payload) => {
    return { ...state, opacity: payload['opacity'].toString() };
  }),
  on(showLoading, (state) => {
    return { ...state, loading: true };
  }),
  on(closeLoading, (state) => {
    return { ...state, loading: false };
  }),
);
