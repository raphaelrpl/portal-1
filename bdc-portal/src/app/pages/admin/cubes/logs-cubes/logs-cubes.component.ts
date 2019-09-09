import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CubeMetadata } from '../cube.interface';

@Component({
  templateUrl: './logs-cubes.component.html',
  styleUrls: ['./logs-cubes.component.scss']
})
export class LogsCubesComponent {

  public cube: CubeMetadata;

  constructor(
    public dialogRef: MatDialogRef<LogsCubesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CubeMetadata) {
      if (data) {
        this.cube = data;
      }
  }
}
