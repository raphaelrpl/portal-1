import { Component, OnInit } from '@angular/core';
import { CubesService } from '../cubes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { bandsBySatSen } from 'src/app/shared/helpers/CONSTS';
import { AuthService } from '../../../auth/auth.service';

@Component({
  templateUrl: './create-cube.component.html',
  styleUrls: ['./create-cube.component.scss']
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
    private fb: FormBuilder) {
      this.formCreateCube = this.fb.group({
        name: ['', [Validators.required]],
        start_date: ['', [Validators.required]],
        last_date: ['', [Validators.required]],
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
      start_date: '',
      last_date: '',
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
    this.cube['datasets'].forEach((satSen: string) => {
      if (Object.keys(bandsBySatSen).indexOf(satSen) >= 0) {
        bandsBySatSen[satSen].forEach( band => {
          if (this.bands.indexOf(band) < 0) {
            this.bands.push(band);
          }
        })
      }
    })
  }

  public async create() {
    try {
      if (this.formCreateCube.status === 'VALID') {
        console.log('create');
        console.log(this.cube);
      }

    } catch(err) {}
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
