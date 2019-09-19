import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSort, MatDialog } from '@angular/material';
import { CubesService } from '../cubes.service';
import { DescribeCubesComponent } from '../describe-cubes/describe-cubes.component';
import { LogsCubesComponent } from '../logs-cubes/logs-cubes.component';
import { EditCubesComponent } from '../edit-cubes/edit-cubes.component';
import { CubeMetadata } from '../cube.interface';
import { AuthService } from '../../../auth/auth.service';

/** 
 * List Cubes Components
 * component to list cubes available
 */
@Component({
  templateUrl: './list-cubes.component.html',
  styleUrls: ['./list-cubes.component.scss']
})
export class ListCubesComponent implements OnInit {

  /** reference to sort table element */
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  
  /** columns of table */
  public displayedColumns: string[];
  /** cubes */
  public dataSource = [];
  /** authorized status of the Read functions */
  public authorized = null;
  /** authorized status of the Write functions */
  public authorizedPOST = null;

  /** import and declare Services */
  constructor(
    private cs: CubesService,
    private as: AuthService,
    public dialog: MatDialog) {}

  /** check authorization of the user and select cubes */
  ngOnInit(): void {
    this.checkAuthorization();
    this.displayedColumns = ['id', 'name', 'author', 'date', 'actions'];
    this.getCubes();
  }

  /**
   * get cubes availables
   */
  private async getCubes() {
    try {
      const response = await this.cs.getCubes();
      if (response) {
        this.dataSource = response.map( (cube: CubeMetadata) => {
          const bands = cube.bands.split(',').join(' | ');
          const quicklook = cube.quicklook.split(',').join(' | ');
          return {...cube, bands, quicklook};
        });
      }
    } catch (err) {}
  }

  /**
   * open dialog with aditional informations of the cube
   */
  public openDetails(cubeInfos: CubeMetadata) {
    this.dialog.open(DescribeCubesComponent, {
      width: '600px',
      maxHeight: '650px',
      data: cubeInfos
    });
  }

  /**
   * open dialog with logs/activities of the cube
   */
  public openLogs(cubeInfos: CubeMetadata) {
    this.dialog.open(LogsCubesComponent, {
      width: '830px',
      maxHeight: '650px',
      data: cubeInfos
    });
  }

  /**
   * open dialog to initialize cube reprocessing
   */
  public openEdit(cubeInfos: CubeMetadata) {
    this.dialog.open(EditCubesComponent, {
      width: '600px',
      data: cubeInfos
    });
  }

  /** check authorizations of the user */
  private checkAuthorization() {
    this.checkAuthGET()
    this.checkAuthPOST()
  }

  /** check authorization of the user - scope GE T*/
  private async checkAuthGET() {
    try {
      const response = await this.as.token('bdc_portal:manage_cubes:get');
      if (response) {
        this.authorized = true;
      } else {
        throw new Error('error');
      }

    } catch (err) {
      this.authorized = false;
    }
  }

  /** check authorization of the user - scope POST */
  private async checkAuthPOST() {
    try {
      const responsePost = await this.as.token('bdc_portal:manage_cubes:post');
      if (responsePost) {
        this.authorizedPOST = true;
      } else {
        throw new Error('error');
      }

    } catch (err) {
      this.authorizedPOST = false;
    }
  }
}
