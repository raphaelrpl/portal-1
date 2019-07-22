import { createReducer, on } from '@ngrx/store';
import { updCollections } from './explore.actions';

export const collections = {};

export const exploreReducer = createReducer(collections,
    on(updCollections, state => state)
);