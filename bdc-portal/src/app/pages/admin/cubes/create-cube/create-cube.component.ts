import { Component, OnInit } from '@angular/core';
import { CubesService } from '../cubes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { bandsBySatSen } from 'src/app/shared/helpers/CONSTS';
import { AuthService } from '../../../auth/auth.service';
import { showLoading, closeLoading } from 'src/app/app.action';
import { AppState } from 'src/app/app.state';
import { Store } from '@ngrx/store';
import { formatDateUSA } from 'src/app/shared/helpers/date';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/helpers/date.adapter';
import { Router } from '@angular/router';
import { MatSnackBar, MAT_DATE_FORMATS, DateAdapter } from '@angular/material';

@Component({
  templateUrl: './create-cube.component.html',
  styleUrls: ['./create-cube.component.scss'],
  providers: [{
    provide: DateAdapter, useClass: AppDateAdapter
  },
  {
    provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
  }]
})
export class CreateCubeComponent implements OnInit {

  public cube: object;
  public formCreateCube: FormGroup;
  public rangeTemporal: Date[];
  public datasets: string [];
  public grids: string[];
  public temporalSchema: string [];
  public bands: string[];
  public authorized = null;
  public dispatch = false;
  public tiles = '';

  constructor(
    private cs: CubesService,
    private as: AuthService,
    public router: Router,
    private snackBar: MatSnackBar,
    private store: Store<AppState>,
    private fb: FormBuilder) {
      this.formCreateCube = this.fb.group({
        name: ['', [Validators.required]],
        startDate: ['', [Validators.required]],
        lastDate: ['', [Validators.required]],
        datasets: ['', [Validators.required]],
        temporalSchema: ['', [Validators.required]],
        step: [{ disabled: true }, []],
        grs: ['', [Validators.required]],
        resx: ['', [Validators.required]],
        resy: ['', [Validators.required]],
        bands: ['', [Validators.required]],
        qlRed: ['', [Validators.required]],
        qlGreen: ['', [Validators.required]],
        qlBlue: ['', [Validators.required]],
        process: [''],
        tiles: ['']
      });
  }

  ngOnInit() {
    this.checkAuthorization();
    this.rangeTemporal = [
      new Date(2016, 9, 1),
      new Date()
    ]
    this.temporalSchema = [
      "ANUAL",
      "MENSAL",
      "SAZONAL"
    ]
    this.datasets = [];
    this.resetForm();
    this.getDatasets();
    this.getGrids();
  }

  private resetForm() {
    this.cube = {
      name: '',
      startDate: '',
      lastDate: '',
      datasets: [],
      temporalSchema: '',
      step: '',
      grs: '',
      resx: '',
      resy: '',
      bands: [],
      qlRed: '',
      qlGreen: '',
      qlBlue: ''
    }
  }

  private async getDatasets() {
    try {
      const response = await this.cs.getDatasets();
      const parser = new DOMParser();
      const xml = parser.parseFromString(response, "text/xml");
      xml.getElementsByTagName('Url')[0].childNodes.forEach( child => {
        const childEl = (child as any);
        if (childEl.attributes && childEl.attributes[0] && childEl.attributes[0].nodeValue === 'dataset') {
          childEl.childNodes.forEach( item => {
            if (item.attributes && item.attributes[0]) {
              this.datasets.push(item.attributes[0].nodeValue);
            }
          })
        }
      })

    } catch(err) {}
  }

  private async getGrids() {
    try {
      const response = await this.cs.getGrids();
      this.grids = Object.values(response).map( grid => grid.name );

    } catch(err) {}
  }

  public getBands() {
    this.bands = [];
    this.cube['bands'] = [];
    this.cube['datasets'].forEach((satSen: string) => {
      if (Object.keys(bandsBySatSen).indexOf(satSen) >= 0) {
        bandsBySatSen[satSen].forEach( band => {
          if (this.bands.indexOf(band) < 0) {
            this.bands.push(band);
            this.cube['bands'].push(band);
          }
        })
      }
    })
  }

  public async create() {
    try {
      if (this.formCreateCube.status === 'VALID') {
        this.store.dispatch(showLoading());
        let query = `datacube=${this.cube['name']}&wrs=${this.cube['grs']}&satsen=${this.cube['datasets'].join(',')}`;
        query += `&tschema=${this.cube['temporalSchema']}&step=${this.cube['step']}&bands=${this.cube['bands'].join(',')}`;
        query += `&start=${formatDateUSA(new Date(this.cube['startDate']))}&end=${formatDateUSA(new Date(this.cube['lastDate']))}`;
        query += `&resx=${this.cube['resx']}&resy=${this.cube['resy']}`;
        query += `&quicklook=${this.cube['qlRed']},${this.cube['qlGreen']},${this.cube['qlBlue']}`;

        const response = await this.cs.create(query);
        if (response) {
          if (this.dispatch) {
            this.snackBar.open('Successfully created cube!', '', {
              duration: 4000,
              verticalPosition: 'top',
              panelClass: 'app_snack-bar-success'
            });
            this.start(this.cube['name'], this.tiles, formatDateUSA(new Date(this.cube['startDate'])), formatDateUSA(new Date(this.cube['lastDate'])));

          } else {
            this.router.navigate(['/admin/cubes']);
            this.store.dispatch(closeLoading());
          }
        } else throw '';
      }

    } catch(err) {
      this.snackBar.open('Error creating cube!', '', {
        duration: 4000,
        verticalPosition: 'top',
        panelClass: 'app_snack-bar-error'
      });
      this.store.dispatch(closeLoading());
    }
  }

  private async start(cubename: string, tiles: string, startDate: string, endDate: string) {
    try {
      const query = `datacube=${cubename}&pr=${tiles}&start=${startDate}&end=${endDate}`;
      const response = await this.cs.start(query);
      if (response) {
        this.snackBar.open('Successfully started cube!', '', {
          duration: 4000,
          verticalPosition: 'top',
          panelClass: 'app_snack-bar-success'
        });
        this.router.navigate(['/admin/cubes']);
      } else throw '';

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

  private async checkAuthorization() {
    try {
      const response = await this.as.token('bdc_portal:manage_cubes:post');
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
