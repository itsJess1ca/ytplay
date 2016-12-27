/* tslint:disable: no-switch-case-fall-through */
import { Action } from '@ngrx/store';

import { PlaylistActions } from './playlist.actions';
import { Song, LoopMode } from './playlist.model';
import { shuffle } from '../../utils/shuffle';
import { PlayerState } from '../../features/youtube-video-player/youtube-video-player.component';

export interface PlaylistState {
  readonly loopMode: LoopMode;
  readonly autoplay: boolean;
  readonly playerVisible: 'visible' | 'notVisible'; // Toggle for if we're visible or not
  readonly length: number; // Length of our song (just to prevent lots of .length() checks)
  readonly activeIndex?: number; // Current song
  readonly shuffled: boolean; // If we're shuffled or not
  readonly songs: Song[]; // Our playlist
  readonly appendEntries: boolean; // Whether or not to add new entries to existing playlists
  readonly unshuffledSongs?: Song[]; // Keep track of original playlist when shuffling
  readonly playerState?: PlayerState;
  readonly volume?: number;
}

export const initialState: PlaylistState = {
  // Settings
  loopMode: 'off',
  autoplay: false,
  volume: 100,

  // Toggles
  playerVisible: 'notVisible',
  appendEntries: false,
  shuffled: false,

  // Playlist
  length: 0,
  activeIndex: -1,
  songs: [],
};

export function playlistReducer(state = initialState, action: Action): PlaylistState {
  switch (action.type) {

    case PlaylistActions.ADD_SONGS: {
      let activeIndex = 0;
      let temp;
      if (state.appendEntries) {
        temp = [...state.songs, ...action.payload];
        let i = temp.length;
        while (i--) {
          const song = temp[i];
          if (song.active) {
            activeIndex = i;
            break;
          }
        }
      } else {
        temp = [...action.payload].map((song, index) => index === 0 ? Object.assign({}, song, {active: true}) : song);
      }
      return Object.assign({}, state, {
        activeIndex: activeIndex,
        length: temp.length,
        songs: temp
      });
    }

    case PlaylistActions.CLEAR_PLAYLIST: {
      return Object.assign({}, state, {songs: [], activeIndex: -1, length: 0, unshuffledSongs: null});
    }

    case PlaylistActions.TOGGLE_PLAYER: {
      return Object.assign({}, state, {playerVisible: state.playerVisible === 'visible' ? 'notVisible' : 'visible'});
    }

    case PlaylistActions.LOOP_MODE: {
      return Object.assign({}, state, {
        loopMode: state.loopMode === 'all' ? 'one' : state.loopMode === 'one' ? 'off' : 'all'
      });
    }

    case PlaylistActions.APPEND_ENTRIES: {
      return Object.assign({} , state, {
        appendEntries: !state.appendEntries
      });
    }

    case PlaylistActions.SHUFFLE: {
      const newList = <Song[]>shuffle(state.songs);
      let newIndex;
      let i = newList.length;
      while (i--) {
        if (newList[i].active) {
          newIndex = i;
          break;
        }
      }
      return Object.assign({}, state, {
        activeIndex: newIndex,
        shuffled: !state.shuffled,
        songs: state.shuffled ? state.unshuffledSongs : newList,
        unshuffledSongs: state.shuffled ? null : state.songs
      });
    }

    case PlaylistActions.PLAYER_STATE: {
      if (action.payload === 0) {
        return Object.assign(nextTrack(state, 'next'), {
          playerState: action.payload
        });
      } else {
        return Object.assign({}, state, {playerState: action.payload});
      }
    }

    case PlaylistActions.CHANGE_VOLUME: {
      return Object.assign({}, state, {
        volume: action.payload
      });
    }

    case PlaylistActions.NEXT_SONG: {
      return nextTrack(state, 'next', true);
    }
    case PlaylistActions.PREVIOUS_SONG: {
      return nextTrack(state, 'prev', true);
    }

    default: {
      return state;
    }
  }
}

export function nextTrack(state: PlaylistState, direction: 'next' | 'prev' = 'next', force: boolean = false): PlaylistState {
  let newIndex;

  if (direction === 'next') {
    if (state.loopMode === 'one' && !force) {
      newIndex = state.activeIndex;
    } else if (state.loopMode === 'all' && state.activeIndex === state.length - 1) {
      newIndex = 0;
    } else if (state.activeIndex + 1 !== state.length) {
      newIndex = state.activeIndex + 1;
    } else {
      newIndex = state.activeIndex;
    }
  } else if (direction === 'prev') {
    if (state.loopMode === 'one' && !force) {
      newIndex = state.activeIndex;
    } else if (state.loopMode === 'all' && state.activeIndex - 1 === -1) {
      newIndex = state.length - 1;
    } else if (state.activeIndex - 1 !== -1) {
      newIndex = state.activeIndex - 1;
    } else {
      newIndex = state.activeIndex;
    }
  }
  let songs;
  if (newIndex !== state.activeIndex) {
    songs = state.songs.map((song, index) => {
      return Object.assign({}, song, {active: index === newIndex});
    });
  } else {
    songs = [...state.songs];
  }
  return Object.assign({}, state, {songs: songs, activeIndex: newIndex});
}

