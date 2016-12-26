/* tslint:disable: member-ordering */
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { PlaylistActions } from './playlist.actions';
import { AppState } from '../index';

@Injectable()

export class PlaylistEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    // private userService: UserService,
    private userActions: PlaylistActions
  ) { }

  /*@Effect() logout$ = this.actions$
    .ofType(UserActions.LOGOUT)
    .map(action => action.payload)
    .switchMap(() => this.userService.logout()
      .mergeMap((res: any) => Observable.of(
        this.userActions.logoutSuccess(res)
        )
      )
      .catch((err) => Observable.of(
        this.userActions.logoutFail(err)
      ))
    );*/
}
