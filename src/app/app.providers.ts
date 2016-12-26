import { YoutubeService } from './services/youtube';
import { UserActions } from './reducers/user/user.actions';
import { PlaylistActions } from './reducers/playlist/playlist.actions';

export const APP_PROVIDERS = [
  YoutubeService,
  UserActions,
  PlaylistActions
];
