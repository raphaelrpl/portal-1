import { Collection } from './sidenav/collection/collection.interface';

export interface ExploreState {
    readonly collections: Collection[];
    readonly loading: boolean;
}