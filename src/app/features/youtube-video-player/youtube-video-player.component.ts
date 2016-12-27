import {
  Component, OnInit, Input, Output, EventEmitter, AfterViewInit
} from '@angular/core';
import { PlaylistState } from '../../reducers/playlist/playlist.reducer';

@Component({
  selector: 'my-youtube-player',
  templateUrl: 'youtube-video-player.component.html',
  styleUrls: ['youtube-video-player.component.css']
})
export class YoutubePlayerComponent implements OnInit, AfterViewInit {
  window = <YTWindow>window;
  player: any;
  _apiReady: boolean;
  _videoId: VideoID;
  _volume: number;

  @Input() playlist: PlaylistState;
  @Input() set videoId(id: VideoID) {
    console.log('new video id', id);
    if (id !== this._videoId) {
      this._videoId = id;
      this.loadVideo(id);
    }
  }

  @Input() set volume(vol: number) {
    this._volume = vol;
    if (this.player) {
      this.player.setVolume(vol);
    }
  }

  @Output() duration: EventEmitter<number> = <EventEmitter<number>>new EventEmitter();
  @Output() playerState = <EventEmitter<PlayerState>>new EventEmitter();

  ngOnInit() {
    this.checkApiStatus();
  }

  ngAfterViewInit() {
  }

  get apiReady() {
    return this._apiReady;
  }

  set apiReady(val: boolean) {
    this._apiReady = val;
    if (val && this._videoId) {
      this.createPlayer(this._videoId);
    }
  }

  checkApiStatus() {
    if (this.window.YoutubeIframeAPIReady) {
      this.apiReady = true;
    } else {
      setTimeout(() => {
        this.checkApiStatus();
      }, 100);
    }
  }

  createPlayer(videoID: string) {
    if (this.apiReady) {
      this.player = new YT.Player('player', {
        playerVars: {
          'autoplay': 0,
          'controls': 0
        },
        height: '480',
        width: '854',
        videoId: videoID,
        events: {
          'onReady': this.playerReady.bind(this),
          'onStateChange': this.playerStateChange.bind(this)
        }
      });
    }
  }

  destroyPlayer() {
    console.log('destroy player');
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }
  }

  playerReady() {
    console.log('Player ready');
    if (this.player) {
      this.playerState.emit(5);
      this.player.setVolume(this._volume);
      this.duration.emit(this.player.getDuration());
    }
  }

  playerStateChange(state: {data: PlayerState, target: any}) {
    this.playerState.emit(state.data);
    if (
      this.playlist.loopMode !== 'off' && state.data === 0 && this.playlist.length === 1 // Repeat mode set to all one a playlist length of 1
      || this.playlist.loopMode === 'one' && state.data === 0 // Repeat mode set to one
    ) {
      console.log('seekTo');
      this.player.seekTo(0, false);
      this.play();
    }
  }

  play() {
    this.player.playVideo();
  }

  pause() {
    this.player.pauseVideo();
  }

  loadVideo(id: VideoID) {
    console.log(`Setting video id to ${id}`);
    if (!this.player && this.apiReady && id) {
      this.createPlayer(id);
      return;
    } else if (this.player && id) {
      this.player.loadVideoById(id);
    }
  }

}

export type PlayerState = -1 | 0 | 1 | 2 | 3 | 5;
