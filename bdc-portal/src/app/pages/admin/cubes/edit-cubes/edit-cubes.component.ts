import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { CubeMetadata } from '../cube.interface';
import { CubesService } from '../cubes.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { closeLoading, showLoading } from 'src/app/app.action';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { formatDateUSA } from 'src/app/shared/helpers/date';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/helpers/date.adapter';

@Component({
  templateUrl: './edit-cubes.component.html',
  styleUrls: ['./edit-cubes.component.scss'],
  providers: [{
    provide: DateAdapter, useClass: AppDateAdapter
  },
  {
    provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
  }]
})
export class EditCubesComponent implements OnInit {

  public cube: CubeMetadata;
  public rangeTemporal: Date[];
  public formStartCube: FormGroup;
  public infos = {
    startDate: null,
    lastDate: null,
    tiles: ''
  }

  constructor(
    public cs: CubesService,
    public dialogRef: MatDialogRef<EditCubesComponent>,
    private snackBar: MatSnackBar,
    private store: Store<AppState>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: CubeMetadata) {
      if (data) {
        this.cube = data;
        this.infos = {
          startDate: new Date(data.start),
          lastDate: new Date(data.end),
          tiles: ''
        }
      }

      this.formStartCube = this.fb.group({
        startDate: ['', [Validators.required]],
        lastDate: ['', [Validators.required]],
        tiles: ['', [Validators.required]]
      });
    }

  ngOnInit(): void {
    this.rangeTemporal = [
      new Date(2016,9,1),
      new Date()
    ]
  }

  public async startProcess() {
    try {
      this.store.dispatch(showLoading());
      if (this.formStartCube.status === 'VALID') {
        let query = `datacube=${this.cube.datacube}&pr=${this.infos.tiles}`;
        query += `&start=${formatDateUSA(this.infos.startDate)}&end=${formatDateUSA(this.infos.lastDate)}`;

        const response = await this.cs.start(query);
        if (response) {
          this.snackBar.open('Successfully started cube!', '', {
            duration: 4000,
            verticalPosition: 'top',
            panelClass: 'app_snack-bar-success'
          });
          this.dialogRef.close();
        } else throw '';
      }

    } catch(err) {
      this.snackBar.open('Error starting cube!', '', {
        duration: 4000,
        verticalPosition: 'top',
        panelClass: 'app_snack-bar-error'
      });

    } finally {
      this.store.dispatch(closeLoading());
    }
  }
}
