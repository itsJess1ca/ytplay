import { Component, OnInit, Input, NgZone, HostBinding, OnChanges } from '@angular/core';
import { PlaylistState } from '../../reducers/playlist/playlist.reducer';
import { Song } from '../../reducers/playlist/playlist.model';

@Component({
  selector: 'my-youtube-playlist',
  templateUrl: 'youtube-playlist.component.html',
  styleUrls: ['youtube-playlist.component.css']
})
export class YoutubePlaylistComponent implements OnInit {
  @Input() playlist: PlaylistState;

  constructor() {
  }

  ngOnInit() {
  }

  trackByFn(index: number, song: Song) {
    return song.videoId;
  }
}
