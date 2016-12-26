/* tslint:disable: member-ordering */
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Song, LoopMode } from './playlist.model';
import { PlayerState } from '../../features/youtube-video-player/youtube-video-player.component';

@Injectable()

export class PlaylistActions {

  static ADD_SONGS = '[Playlist] Add Songs';
  addSongs(songs: Song[]): Action {
    return {
      type: PlaylistActions.ADD_SONGS,
      payload: songs
    };
  }

  static REMOVE_SONG = '[Playlist] Remove Song';
  removeSong(id: VideoID): Action {
    return {
      type: PlaylistActions.REMOVE_SONG,
      payload: id
    };
  }

  static NEXT_SONG = '[Playlist] Next Song';
  nextSong(): Action {
    return {
      type: PlaylistActions.NEXT_SONG
    };
  }

  static SHUFFLE = '[Playlist] Shuffle';
  shuffle(): Action {
    return {
      type: PlaylistActions.SHUFFLE
    };
  }

  static LOOP_MODE = '[Playlist] Change Loop Mode';
  loopMode(): Action {
    return {
      type: PlaylistActions.LOOP_MODE
    };
  }

  static APPEND_ENTRIES = '[Playlist] Append Entries toggle';
  appendEntriesToggle(): Action {
    return {
      type: PlaylistActions.APPEND_ENTRIES
    };
  }

  static TOGGLE_PLAYER = '[Playlist] Toggle player visibility';
  togglePlayer(): Action {
    return {
      type: PlaylistActions.TOGGLE_PLAYER
    };
  }
  static PLAYER_STATE = '[Playlist] Toggle player state';
  playerState(val: PlayerState): Action {
    return {
      type: PlaylistActions.PLAYER_STATE,
      payload: val
    };
  }

  static CHANGE_VOLUME = '[Playlist] Change Volume';
  changeVolume(val: number): Action {
    return {
      type: PlaylistActions.CHANGE_VOLUME,
      payload: val
    };
  }
}
