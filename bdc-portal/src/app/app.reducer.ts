import { createReducer, on } from '@ngrx/store';
import {
  showLoading,
  closeLoading
} from './app.action';
import { AppState } from './app.state';

/** initial values to App State */
const initialState: AppState = {
  loading: false
};

/**
 * reducer to manage App state
 * set new values in AppState
 */
export const reducer = createReducer(initialState,
  on(showLoading, (state) => {
    return { ...state, loading: true };
  }),
  on(closeLoading, (state) => {
    return { ...state, loading: false };
  }),
);
