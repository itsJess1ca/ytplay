import {
  Component, OnInit, ViewChild, NgZone, Input, Output, EventEmitter, Renderer,
  HostBinding, AfterViewInit
} from '@angular/core';
import { AppState } from '../../reducers/index';
import { Store } from '@ngrx/store';
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

  @Input() set videoId(id: VideoID) {
    if (!this.player && this.apiReady) {
      this.createPlayer(id);
      return;
    }
    if (id !== this._videoId) {
      this._videoId = id;
      if (this.player) {
        this.loadVideo(id);
        return;
      }
    }
  }
  @Input() autoplay: boolean = false;
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
    console.log(`youtube api status: ${val}`);
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
    console.log('Create player');
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

  playerReady() {
    console.log('Player ready');
    this.playerState.emit(5);
    this.player.setVolume(this._volume);
    this.duration.emit(this.player.getDuration());
  }

  playerStateChange(state: {data: PlayerState, target: any}) {
    this.playerState.emit(state.data);
  }

  play() {
    this.player.playVideo();
  }
  pause() {
    this.player.pauseVideo();
  }

  loadVideo(id: VideoID) {
    if (this.autoplay) {
      this.player.loadVideoById(id);
    } else {
      this.player.cueVideoById(id);
    }
  }

}

export type PlayerState = -1 | 0 | 1 | 2 | 3 | 5;
