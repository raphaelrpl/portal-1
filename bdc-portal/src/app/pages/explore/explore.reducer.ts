import { ExploreAction, ExploreActionTypes } from './explore.action';
import { ExploreState } from './explore.state';

const initialState: ExploreState = {
  collections: [{
    id: '152',
    name: 'name-test'
  }]
}

export function reducer(state: ExploreState = initialState, action: ExploreAction) {
  switch (action.type) {
    case ExploreActionTypes.COLLECTIONS:
      return action.payload
    default:
      return state
  }
}