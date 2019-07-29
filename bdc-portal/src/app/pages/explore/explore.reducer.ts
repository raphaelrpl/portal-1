import { createReducer, on } from '@ngrx/store';
import { collections, showLoading, closeLoading, setLayers, addLayer } from './explore.action';
import { ExploreState } from './explore.state';

const initialState: ExploreState = {
  collections: [],
  layers: [],
  loading: false
}

export const reducer = createReducer(initialState,
  on(collections, (state, payload) => {
    return {...state, collections: payload }
  }),
  on(setLayers, (state, payload) => {
    return {...state, layers: payload }
  }),
  on(addLayer, (state, payload) => {
    return {...state, layers: [...state.layers, payload]}
  }),
  on(showLoading, (state) => {
    return {...state, loading: true}
  }),
  on(closeLoading, (state) => {
    return {...state, loading: false}
  }),
);
