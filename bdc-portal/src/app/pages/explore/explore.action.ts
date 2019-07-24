import { createAction, props } from '@ngrx/store';
import { Collection } from './sidenav/collection/collection.interface';

export const collections = createAction(
    '[Explore Component] Collections',
    props<Collection[]>()
);

export const showLoading = createAction(
    '[Loading Component] showLoading'
);

export const closeLoading = createAction(
    '[Loading Component] closeLoading'
);