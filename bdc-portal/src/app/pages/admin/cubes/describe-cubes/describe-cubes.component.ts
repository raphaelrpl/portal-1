import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { formatDateUSA } from 'src/app/shared/helpers/date';
import { CubesService } from '../cubes.service';
import { CubeMetadata } from '../cube.interface';

/**
 * Describe Cube component
 * component used to display aditional informations of the cube
 */
@Component({
  templateUrl: './describe-cubes.component.html',
  styleUrls: ['./describe-cubes.component.scss']
})
export class DescribeCubesComponent {

  /** cube informations */
  public cube: CubeMetadata;
  /** number of processing activities performed on this cube */
  public status = {};
  /** list with activities types */
  public statusList = [];

  /** get cube informations and get cube activities */
  constructor(
    private cs: CubesService,
    public dialogRef: MatDialogRef<DescribeCubesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CubeMetadata) {
      if (data) {
        this.cube = {
          ...data,
          start: formatDateUSA(new Date(data.start)),
          end: formatDateUSA(new Date(data.end)),
        };

        this.getStatus(data.datacube);
      }
  }

  /** get cube activities separated by status/type */
  private async getStatus(cubeName: string) {
    try {
      const response = await this.cs.getProcessByCube(cubeName);
      if (response) {
        response.forEach( status => {
          this.statusList.push(status.status);
          this.status[status.status] = status['count(*)'];
        });
      }

    } catch (err) {
      this.status = {};
    }
  }
}
