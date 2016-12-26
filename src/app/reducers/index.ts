import { compose } from '@ngrx/core/compose';
import { ActionReducer, combineReducers } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { storeLogger } from 'ngrx-store-logger';

import * as fromUser from './user/user.reducer';
import * as fromPlaylist from './playlist/playlist.reducer';
import { localStorageSync } from 'ngrx-store-localstorage';

const modules = {
  'user': fromUser,
  'playlist': fromPlaylist
};

export interface AppState {
  user: fromUser.UserState;
  playlist: fromPlaylist.PlaylistState;
}

export const reducers = {
  user: fromUser.userReducer,
  playlist: fromPlaylist.playlistReducer
};

// Generate a reducer to set the root state in dev mode for HMR
function stateSetter(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    if (action.type === 'SET_ROOT_STATE') {
      return action.payload;
    }
    return reducer(state, action);
  };
}

const resetOnLogout = (reducer: Function) => {
  return function (state, action) {
    let newState;
    if (action.type === '[User] Logout Success') {
      newState = Object.assign({}, state);
      Object.keys(modules).forEach((key) => {
        newState[key] = modules[key]['initialState'];
      });
    }
    return reducer(newState || state, action);
  };
};

const DEV_REDUCERS = [stateSetter, storeFreeze, storeLogger()];

const MY_REDUCERS = [];

MY_REDUCERS.push(localStorageSync(['playlist', 'user'], true));

const developmentReducer: Function = compose(...MY_REDUCERS, ...DEV_REDUCERS, resetOnLogout, combineReducers)(reducers);
const productionReducer: Function = compose(...MY_REDUCERS, resetOnLogout, combineReducers)(reducers);

export function rootReducer(state: any, action: any) {
  if (ENV !== 'development') {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}
