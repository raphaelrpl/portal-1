import { createAction, props } from '@ngrx/store';

/**
 * set response of user login
 */
export const Login = createAction(
    '[Explore Component] Login',
    props<Object>()
);

/**
 * set user login with null (logout)
 */
export const Logout = createAction(
    '[Explore Component] Logout'
);