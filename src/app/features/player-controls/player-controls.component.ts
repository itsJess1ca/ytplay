import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers/index';
import { PlaylistState } from '../../reducers/playlist/playlist.reducer';
import { Observable } from 'rxjs';
import { LoopMode } from '../../reducers/playlist/playlist.model';
import { MdDialog, MdDialogRef, MdSlider, MdSliderChange } from '@angular/material';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'my-player-controls',
  templateUrl: 'player-controls.component.html',
  styleUrls: ['player-controls.component.css']
})
export class PlayerControlsComponent {

  // Playlist Tracking
  @Input() playlist: PlaylistState;
  @Input() currentIndex: number;
  @Input() playlistLength: number = 0;

  @Input() set duration(duration: number) {
    // Convert second value returned from youtube, to milliseconds
    this._duration = duration * 1000;
  };

  // Toggles
  @Output() addToExistingPlaylist = <EventEmitter<boolean>>new EventEmitter();
  @Output() showPlayer = <EventEmitter<boolean>>new EventEmitter();

  // Settings
  @Output() shuffleChange = <EventEmitter<boolean>>new EventEmitter();
  @Output() loopModeChange = <EventEmitter<LoopMode>>new EventEmitter();

  // Core
  @Output() nextTrack: EventEmitter<any> = new EventEmitter();
  @Output() previousTrack: EventEmitter<any> = new EventEmitter();
  @Output() search = <EventEmitter<string>>new EventEmitter();
  @Output() play = <EventEmitter<boolean>>new EventEmitter();
  @Output() volume = <EventEmitter<number>>new EventEmitter();
  @Output() clearPlaylist: EventEmitter<any> = new EventEmitter();

  _unmutedVol: number;

  private _duration: number = 0;
  private currentTime: number = 0;
  private playing: boolean = false;
  private dialogRef: MdDialogRef<ConfirmDialog>;


  constructor(public dialog: MdDialog) {}

  get playerStateTooltip() {
    switch (this.playlist.playerState) {
      case 1:
        return 'Pause';
      default:
        return 'Play';
    }
  }

  openDialog() {
    this.dialogRef = this.dialog.open(ConfirmDialog);
    this.dialogRef.componentInstance.data = {title: 'Are you sure you want to clear your playlist?'};

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clearPlaylist.emit();
      }
    });
  }

  onEnter(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      const el: any = event.target;
      this.search.emit(el.value);
    }
  }

  get loopMode() {
    return this.playlist.loopMode;
  }

  get loopModeIcon() {
    switch (this.loopMode) {
      case 'all':
        return 'repeat';
      case 'one':
        return 'repeat_one';
      case 'off':
      default:
        return 'repeat';
    }
  }

  toggleLoopMode() {
    this.loopModeChange.emit();
  }

  shuffle() {
    this.shuffleChange.emit();
  }
  volumeUpdate(volume: MdSliderChange | number | 'unmute' | 'mute') {
    switch (volume.constructor) {
      case String:
        if (volume === 'unmute') {
          this.volume.emit(this._unmutedVol);
          this._unmutedVol = null;
        } else if (volume === 'mute') {
          this._unmutedVol = this.playlist.volume;
          this.volume.emit(0);
        }
        break;
      case MdSliderChange:
        let v = <MdSliderChange>volume;
        this.volume.emit(v.value);
        if (this._unmutedVol) this._unmutedVol = null;
        break;
      default:
        break;
    }
  }
}
