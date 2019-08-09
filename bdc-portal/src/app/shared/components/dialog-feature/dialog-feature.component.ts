import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Feature } from 'src/app/pages/explore/sidenav/collection/collection.interface';

@Component({
  selector: 'app-dialog-feature',
  templateUrl: './dialog-feature.component.html',
  styleUrls: ['./dialog-feature.component.scss']
})
export class DialogFeatureComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogFeatureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Feature) {
    }

}
