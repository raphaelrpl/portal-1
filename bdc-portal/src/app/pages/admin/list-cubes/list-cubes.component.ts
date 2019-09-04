import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSort, MatDialog } from '@angular/material';
import { CubesService } from './cubes.service';
import { DescribeCubesComponent } from '../describe-cubes/describe-cubes.component';

@Component({
  templateUrl: './list-cubes.component.html',
  styleUrls: ['./list-cubes.component.scss']
})
export class ListCubesComponent implements OnInit {

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  public displayedColumns: string[];
  public dataSource = [];

  constructor(private cs: CubesService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.displayedColumns = ['id', 'name', 'author', 'date', 'actions'];
    this.getCubes();
  }

  private async getCubes() {
    try {
      const response = await this.cs.getCubes()
      if (response) {
        this.dataSource = response.map( cube => {
          const bands = cube.bands.split(',').join(' | ');
          const quicklook = cube.quicklook.split(',').join(' | ');
          return {...cube, bands, quicklook}
        });
      }
    } catch(err) {}
  }

  public openDetails(cubeInfos) {
    this.dialog.open(DescribeCubesComponent, {
      width: '600px',
      height: '600px',
      data: cubeInfos
    });
  }
}
