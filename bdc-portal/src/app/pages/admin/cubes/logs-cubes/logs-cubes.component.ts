import { Component, Inject, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { CubeMetadata } from '../cube.interface';
import { closeLoading, showLoading } from 'src/app/app.action';
import { AppState } from 'src/app/app.state';
import { Store } from '@ngrx/store';
import { CubesService } from '../cubes.service';
import { Activity } from './activity.interface';

@Component({
  templateUrl: './logs-cubes.component.html',
  styleUrls: ['./logs-cubes.component.scss']
})
export class LogsCubesComponent implements AfterViewInit {

  public cube: CubeMetadata;

  public displayedColumns = ['action', 'cube', 'tileid', 'period'];
  public dataSource = new MatTableDataSource([{} as Activity]);

  public statusList = ['DONE', 'DOING', 'NOTDONE', 'ERROR', 'SUSPEND', 'CHECK'];
  public status = 'DOING';

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    public cs: CubesService,
    private snackBar: MatSnackBar,
    private store: Store<AppState>,
    private ref: ChangeDetectorRef,
    public dialogRef: MatDialogRef<LogsCubesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CubeMetadata) {
      if (data) {
        this.cube = data;
      }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public async searchActivities() {
    try {
      this.store.dispatch(showLoading());
      const response = await this.cs.getActivities(this.cube.datacube, this.status);
      const activities = response.split('}}')[1].split('\n').slice(1, -1);
      const activitiesList = activities.map( activity => {
        const activityDetails = activity.split(' - ');
        const activityDetailsFile = activityDetails[3].split(' ');
        return {
          action: activityDetails[1],
          cube: activityDetailsFile[0],
          tileid: activityDetailsFile[1],
          period: `${activityDetailsFile[2]} / ${activityDetailsFile[4]}`
        };
      });
      this.dataSource.data = activitiesList;

    } catch (err) {
      this.dataSource.data = [];
      this.snackBar.open('Activities not found!', '', {
        duration: 4000,
        verticalPosition: 'top',
        panelClass: 'app_snack-bar-error'
      });

    } finally {
      this.ref.detectChanges();
      this.store.dispatch(closeLoading());
    }
  }

  public applyFilter(value: string) {
    this.dataSource.filter = value.trim();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
