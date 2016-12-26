import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'confirm-dialog',
  template: `
    <h1 md-dialog-title>{{data.title || 'Are you sure?'}}</h1>
    <md-dialog-actions>
      <button md-button (click)="dialogRef.close(true)">Yes</button>
      <button md-button md-dialog-close>No</button>
    </md-dialog-actions>
  `
})
export class ConfirmDialog {
  data: {title?: string} = {};
  constructor(public dialogRef: MdDialogRef<ConfirmDialog>) {}
}
