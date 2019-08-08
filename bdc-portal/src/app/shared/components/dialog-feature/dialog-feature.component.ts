import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-feature',
  templateUrl: './dialog-feature.component.html',
  styleUrls: ['./dialog-feature.component.scss']
})
export class DialogFeatureComponent {

  constructor(public dialogRef: MatDialogRef<DialogFeatureComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
