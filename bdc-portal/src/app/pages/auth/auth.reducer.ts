import { createReducer, on } from '@ngrx/store';
import {
  Login, Logout
} from './auth.action';
import { AuthState } from './auth.state';

/** initial values to Auth State */
const initialState: AuthState = {
  userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))['userId'] : '',
  token: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))['token'] : ''
};

/**
 * reducer to manage Auth state
 * set new values in AuthState
 */
export const reducer = createReducer(initialState,
  on(Login, (state, payload) => {
    localStorage.setItem('user', JSON.stringify(payload));
    return { ...state, userId: payload['userId'].toString(), token: payload['token'].toString() };
  }),
  on(Logout, (state) => {
    localStorage.removeItem('user');
    return { ...state, userId: '', token: '' };
  })
);
