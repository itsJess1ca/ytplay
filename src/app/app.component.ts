import { Component, OnInit, ViewChild, trigger, state, style, transition, animate } from '@angular/core';
import { YoutubeService } from './services/youtube';
import { YoutubePlayerComponent, PlayerState } from './features/youtube-video-player/youtube-video-player.component';
import { AppState } from './reducers/index';
import { Store } from '@ngrx/store';
import { PlaylistActions } from './reducers/playlist/playlist.actions';
import { PlaylistState } from './reducers/playlist/playlist.reducer';
import { LoopMode } from './reducers/playlist/playlist.model';


@Component({
  selector: 'my-app',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
  animations: [
    trigger('playerVisible__player', [
      state('visible', style({
        opacity: 1,
        'pointer-events': 'auto'
      })),
      state('notVisible', style({
        opacity: 0,
        'pointer-events': 'none'
      })),
      transition('visible => notVisible', animate('0.4s')),
      transition('notVisible => visible', animate('0.4s 0.3s'))
    ]),
    trigger('playerVisible__playlist', [
      state('visible', style({
        transform: '*'
      })),
      state('notVisible', style({
        transform: 'translateY(-480px)'
      })),
      transition('visible => notVisible', animate('0.2s 0.5s')),
      transition('notVisible => visible', animate('0.2s'))
    ])
  ]
})
export class AppComponent implements OnInit {
  @ViewChild(YoutubePlayerComponent) player;
  addToExistingPlaylist: boolean = false;
  currentIndex: number = -1;
  currentIds: string[] = [];
  currentVideoId: VideoID = null;
  duration: number;
  playlist: PlaylistState;

  constructor(private store: Store<AppState>,
              private playlistActions: PlaylistActions,
              public yt: YoutubeService) { }

  ngOnInit() {
    this.store.select('playlist').subscribe((playlist: PlaylistState) => {
      this.playlist = playlist;
      if (this.playlist.length === 0 && this.player.player) {
        console.log('destroy player');
        this.player.destroyPlayer();
      }
      if (this.playlist.playerVisible === 'visible' && this.playlist.length === 0) {
        console.log('toggle player visibility');
        this.store.dispatch(this.playlistActions.togglePlayer());
      }
    });
  }

  fetchPlaylist(playlistId: string) {
    if (playlistId !== '' && this.currentIds.indexOf(playlistId) === -1 || this.playlist.songs.length === 0) {
      if (this.addToExistingPlaylist) {
        this.currentIds = [...this.currentIds, playlistId];
      } else {
        this.currentIds = [playlistId];
      }
      this.yt.handleQuery(playlistId)
        .then(playlist => {
          this.store.dispatch(this.playlistActions.addSongs(playlist));
        })
        .catch((err) => console.error(err));
    }
  }

  play(val: boolean) {
    val ? this.player.play() : this.player.pause();
  }

  togglePlayer() {
    this.store.dispatch(this.playlistActions.togglePlayer());
  }

  onLoopModeChange() {
    this.store.dispatch(this.playlistActions.loopMode());
  }

  toggleAddToExistingPlaylist() {
    this.store.dispatch(this.playlistActions.appendEntriesToggle());
  }

  shuffle() {
    this.store.dispatch(this.playlistActions.shuffle());
  }

  updatePlayerState(state: PlayerState) {
    this.store.dispatch(this.playlistActions.playerState(state));
  }

  volumeChange(volume: number) {
    this.store.dispatch(this.playlistActions.changeVolume(volume));
  }

  previousTrack() {
    this.store.dispatch(this.playlistActions.previousSong());
  }

  nextTrack() {
    this.store.dispatch(this.playlistActions.nextSong());
  }

  clearPlaylist() {
    this.store.dispatch(this.playlistActions.clearPlaylist());
  }
}
