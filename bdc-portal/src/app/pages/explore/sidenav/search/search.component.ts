import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { rectangle, LatLngBoundsExpression, Layer } from 'leaflet';

import { SearchService } from './search.service';
import { ExploreState } from '../../explore.state';
import { formatDateUSA, getLastDateMonth } from 'src/app/shared/helpers/date';
import {
  showLoading, closeLoading, setLayers, setPositionMap,
  setRangeTemporal, setFeatures, setBands, setGrid, setTStep, setTSchema
} from '../../explore.action';

/**
 * component to search data of the BDC project
 * search => STAC and WMS
 */
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  /** emit event to sidenav */
  @Output() stepToEmit = new EventEmitter();

  /** Existing resources */
  public productsList: object[];
  /** selected resources by user */
  public products: string[];
  /** available cubes */
  public collections: string[];
  /** range with dates to search */
  public rangeTemporal: Date[];
  /** range with dates avalaible by selected cube */
  public rangeTemporalEnabled: Date[];
  /** cubes type */
  public typesCollection: string[];
  /** infos with parameters to search Cube */
  public searchObj: object;
  /** layers enabled in the map */
  private layers: Layer[];

  private bands: string[];
  private grid: string[];
  private tschema: string;
  private tstep: string;

  public formSearch: FormGroup;

  /**
   * get infos of store application and set group of validators
   */
  constructor(
    private ss: SearchService,
    private snackBar: MatSnackBar,
    private store: Store<ExploreState>,
    private fb: FormBuilder) {
      this.store.pipe(select('explore')).subscribe(res => {
        if (res.layers) {
          this.layers = Object.values(res.layers).slice(0, (Object.values(res.layers).length - 1)) as Layer[];
        }
        if (res.bbox) {
          const bbox = Object.values(res.bbox);
          this.searchObj['bbox'] = {
            north: bbox[1]['lat'],
            south: bbox[0]['lat'],
            west: bbox[0]['lng'],
            east: bbox[1]['lng']
          };
        }
      });

      this.formSearch = this.fb.group({
        products: ['', [Validators.required]],
        cube: ['', [Validators.required]],
        north: ['', [Validators.required]],
        west: ['', [Validators.required]],
        east: ['', [Validators.required]],
        south: ['', [Validators.required]],
        start_date: ['', [Validators.required]],
        last_date: ['', [Validators.required]],
        type: ['', [Validators.required]]
      })
    }

  /**
   * set basic values used to mount component
   */
  ngOnInit() {
    this.productsList = [
      {
        title: 'cubes',
        disabled: false,
        searchFunction: this.searchFeatures
      }, {
        title: 'samples',
        disabled: true
      }, {
        title: 'classification',
        disabled: true
      }
    ];

    this.getCollections();
    this.resetSearch();
    this.rangeTemporal = [];
  }

  /**
   * get available cubes
   */
  private async getCollections() {
    try {
      const response = await this.ss.getCollections();
      this.collections = [];
      response.links.forEach( c => {
        if (c.rel === 'child') {
          this.collections.push(c.title);
        }
      });
    } catch (err) {
    }
  }

  /**
   * search feature/items in BDC-STAC
   */
  private async searchFeatures(vm: SearchComponent) {
    try {
      vm.store.dispatch(showLoading());

      // set FIRST DAY in start date and LAST DAY in last date
      const startDate = new Date(vm.searchObj['start_date'].setDate(1));
      const lastDate = new Date(vm.searchObj['last_date'].setDate(getLastDateMonth(new Date(vm.searchObj['last_date']))));

      const bbox = Object.values(vm.searchObj['bbox']);
      let query = `type=${vm.searchObj['types']}`;
      query += `&collections=${vm.searchObj['cube']}`;
      query += `&bbox=${bbox[2]},${bbox[1]},${bbox[3]},${bbox[0]}`;
      query += `&time=${formatDateUSA(startDate)}`;
      query += `/${formatDateUSA(lastDate)}`;
      query += `&limit=10000`;

      const response = await vm.ss.searchSTAC(query);
      if (response.features.length > 0) {
        vm.store.dispatch(setBands(vm.bands));
        vm.store.dispatch(setTSchema({tschema: vm.tschema}));
        vm.store.dispatch(setTStep({tstep: vm.tstep || 0}));
        vm.store.dispatch(setGrid({grid: vm.grid}));
        vm.store.dispatch(setRangeTemporal([
          startDate,
          lastDate
        ]));
        vm.store.dispatch(setFeatures(response.features));
        vm.changeStepNav(1);

      } else {
        vm.store.dispatch(setFeatures([]));
        vm.changeStepNav(0);
        vm.snackBar.open('RESULTS NOT FOUND!', '', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: 'app_snack-bar-error'
        });
      }

    } catch (err) {
      vm.changeStepNav(0);
      vm.snackBar.open('INCORRECT SEARCH!', '', {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: 'app_snack-bar-error'
      });

    } finally {
      const newLayers = vm.layers.filter( lyr => !lyr['options'].alt || (lyr['options'].alt && lyr['options'].alt.indexOf('qls_') < 0));
      vm.store.dispatch(setLayers(newLayers));
      vm.store.dispatch(closeLoading());
    }
  }

  /**
   * clean fields in the search form
   */
  private resetSearch() {
    this.searchObj = {
      cube: '',
      bbox: {
        north: null,
        south: null,
        west: null,
        east: null
      },
      type: [],
      step: null,
      start_date: '',
      last_date: ''
    };
  }

  /**
   * get cube infos by name
   */
  public async getCollection(name: string) {
    try {
      const response = await this.ss.getCollectionByName(name);

      // set times (range temporal of cube)
      const times = response.extent.time;
      this.rangeTemporal = [
        new Date(times[0]),
        new Date(times[1])
      ];
      // set collection types
      this.typesCollection = response.properties['bdc:time_aggregations'].filter(
        t => t.name !== 'SCENE' && t.name !== 'MERGED').map((t => t.name));
      // set bands
      this.bands = response.properties['bdc:bands'];
      // set wrs/grid
      this.grid = response['properties']['bdc:wrs'];
      // set temporal schema and temporal step if monthly
      this.tschema = response['properties']['bdc:tschema']
      this.tstep = response['properties']['bdc:tstep']

    } catch (_) {}
  }

  /**
   * initialize search in selected resources
   */
  public search() {
    if (this.formSearch.status !== 'VALID') {
      this.changeStepNav(0);
      this.snackBar.open('Fill in all fields correctly!', '', {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: 'app_snack-bar-error'
      });

    } else {
      const vm = this;
      this.products.forEach((product: any) => {
        const productObj = this.productsList.filter(p => p['title'] === product);
        productObj[0]['searchFunction'](vm);
      });
    }
  }

  /**
   * change menu displayed
   */
  private changeStepNav(step: number) {
    this.stepToEmit.emit(step);
  }

  /**
   * view bounding box in map
   */
  public previewBbox() {
    this.removeLayerBbox();
    const bounds: LatLngBoundsExpression = [
      [this.searchObj['bbox'].north, this.searchObj['bbox'].east],
      [this.searchObj['bbox'].south, this.searchObj['bbox'].west]
    ];
    const newLayers = rectangle(bounds, {
      color: '#666',
      weight: 1,
      className: 'previewBbox'
    }).bringToFront();

    this.layers.push(newLayers);
    this.store.dispatch(setLayers(this.layers));
    this.store.dispatch(setPositionMap(newLayers.getBounds()));
  }

  /**
   * remove bounding box of the map
   */
  public removeLayerBbox() {
    this.layers = this.layers.filter( lyr => lyr['options'].className !== 'previewBbox');
    this.store.dispatch(setLayers(this.layers));
  }

  /**
   * return if exists all selected coordinates
   */
  public bboxNotEmpty(): boolean {
    return this.searchObj['bbox'].north && this.searchObj['bbox'].south && this.searchObj['bbox'].east && this.searchObj['bbox'].west;
  }
}
