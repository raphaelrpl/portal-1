import { createReducer, on } from '@ngrx/store';
import { collections, showLoading, closeLoading } from './explore.action';
import { ExploreState } from './explore.state';

const initialState: ExploreState = {
  collections: [],
  loading: false
}

export const reducer = createReducer(initialState,
  on(collections, (state, payload) => {
    return {...state, collections: payload }
  }),
  on(showLoading, (state) => {
    return {...state, loading: true}
  }),
  on(closeLoading, (state) => {
    return {...state, loading: false}
  }),
);
