import { NotFound404Component } from './not-found404.component';
import { YoutubePlayerComponent } from './features/youtube-video-player/youtube-video-player.component';
import { YoutubePlaylistComponent } from './features/youtube-playlist/youtube-playlist.component';
import { PlayerControlsComponent } from './features/player-controls/player-controls.component';
import { ConfirmDialog } from './features/confirm-dialog/confirm-dialog.component';

export const APP_DECLARATIONS = [
  YoutubePlayerComponent,
  YoutubePlaylistComponent,
  PlayerControlsComponent,
  NotFound404Component,
  ConfirmDialog
];
