import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSort, MatDialog } from '@angular/material';
import { CubesService } from '../cubes.service';
import { DescribeCubesComponent } from '../describe-cubes/describe-cubes.component';
import { LogsCubesComponent } from '../logs-cubes/logs-cubes.component';
import { CubeMetadata } from '../cube.interface';
import { AuthService } from '../../../auth/auth.service';

@Component({
  templateUrl: './list-cubes.component.html',
  styleUrls: ['./list-cubes.component.scss']
})
export class ListCubesComponent implements OnInit {

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  public displayedColumns: string[];
  public dataSource = [];
  public authorized = null;

  constructor(
    private cs: CubesService,
    private as: AuthService,
    public dialog: MatDialog) {}

  ngOnInit(): void {
    this.checkAuthorization();
    this.displayedColumns = ['id', 'name', 'author', 'date', 'actions'];
    this.getCubes();
  }

  private async getCubes() {
    try {
      const response = await this.cs.getCubes()
      if (response) {
        this.dataSource = response.map( (cube: CubeMetadata) => {
          const bands = cube.bands.split(',').join(' | ');
          const quicklook = cube.quicklook.split(',').join(' | ');
          return {...cube, bands, quicklook}
        });
      }
    } catch(err) {}
  }

  public openDetails(cubeInfos: CubeMetadata) {
    this.dialog.open(DescribeCubesComponent, {
      width: '600px',
      height: '600px',
      data: cubeInfos
    });
  }

  public openLogs(cubeInfos: CubeMetadata) {
    this.dialog.open(LogsCubesComponent, {
      width: '600px',
      height: '500px',
      data: cubeInfos.id
    });
  }

  private async checkAuthorization() {
    try {
      const response = await this.as.token('bdc_portal:manage_cubes:get');
      if (response) {
        this.authorized = true;
      } else {
        throw '';
      }
    } catch(err) {
      this.authorized = false;
    }
  }
}
