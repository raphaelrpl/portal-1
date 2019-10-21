import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-side-by-side-box',
  templateUrl: './side-by-side-box.component.html',
  styleUrls: ['./side-by-side-box.component.scss']
})
export class SideBySideBoxComponent {

  /** receive infos to display in this component */
  constructor(
    public dialogRef: MatDialogRef<SideBySideBoxComponent>) {
  }

}
