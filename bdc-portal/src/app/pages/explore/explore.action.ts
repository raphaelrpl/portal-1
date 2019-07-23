import { Action } from '@ngrx/store';
import { Collection } from './sidenav/collection/collection.interface';

export namespace ExploreActionTypes {
  export const COLLECTIONS = '[Collection] changeCollections';
}

export class CollectionsAction implements Action {
  readonly type = ExploreActionTypes.COLLECTIONS;
  public payload: Collection[];

  constructor(public items: Collection[]) {
    this.payload = items;
  }
}

export type ExploreAction = CollectionsAction;
