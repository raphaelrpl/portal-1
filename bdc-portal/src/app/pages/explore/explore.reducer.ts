import { createReducer, on } from '@ngrx/store';
import {
  showLoading,
  closeLoading,
  setLayers,
  setBbox,
  setPositionMap,
  setRangeTemporal,
  setCollections
} from './explore.action';
import { ExploreState } from './explore.state';

const initialState: ExploreState = {
  collections: [],
  layers: [],
  positionMap: null,
  loading: false,
  bbox: null,
  rangeTemporal: []
}

export const reducer = createReducer(initialState,
  on(setCollections, (state, payload) => {
    return { ...state, collections: payload }
  }),
  on(setLayers, (state, payload) => {
    return { ...state, layers: payload }
  }),
  on(setPositionMap, (state, payload) => {
    return { ...state, positionMap: payload }
  }),
  on(setRangeTemporal, (state, payload) => {
    return { ...state, rangeTemporal: payload }
  }),
  on(setBbox, (state, payload) => {
    return { ...state, bbox: payload }
  }),
  on(showLoading, (state) => {
    return { ...state, loading: true }
  }),
  on(closeLoading, (state) => {
    return { ...state, loading: false }
  }),
);
