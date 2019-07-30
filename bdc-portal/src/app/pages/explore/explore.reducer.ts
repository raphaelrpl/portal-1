import { createReducer, on } from '@ngrx/store';
import { collections, showLoading, closeLoading, setLayers, setPositionMap } from './explore.action';
import { ExploreState } from './explore.state';
import { LatLngBoundsExpression } from 'leaflet';

const initialState: ExploreState = {
  collections: [],
  layers: [],
  positionMap: null,
  loading: false
}

export const reducer = createReducer(initialState,
  on(collections, (state, payload) => {
    return {...state, collections: payload }
  }),
  on(setLayers, (state, payload) => {
    return {...state, layers: payload }
  }),
  on(setPositionMap, (state, payload) => {
    return {...state, positionMap: payload }
  }),
  on(showLoading, (state) => {
    return {...state, loading: true}
  }),
  on(closeLoading, (state) => {
    return {...state, loading: false}
  }),
);
