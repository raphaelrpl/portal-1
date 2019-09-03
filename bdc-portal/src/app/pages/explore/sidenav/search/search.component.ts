import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { rectangle, LatLngBoundsExpression } from 'leaflet';

import { SearchService } from './search.service';
import { ExploreState } from '../../explore.state';
import { formatDateUSA, getLastDateMonth } from 'src/app/shared/helpers/date';
import {
  setLayers, setPositionMap, setBands,
  setRangeTemporal, setFeatures, setGrid, setTStep, setTSchema, setSamples, removeGroupLayer, setBbox
} from '../../explore.action';
import { showLoading, closeLoading } from 'src/app/app.action';

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
        cube: [''],
        north: ['', [Validators.required]],
        west: ['', [Validators.required]],
        east: ['', [Validators.required]],
        south: ['', [Validators.required]],
        start_date: ['', [Validators.required]],
        last_date: ['', [Validators.required]],
        type: ['']
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
        disabled: false,
        searchFunction: this.searchSamples
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
  private async searchFeatures(vm: SearchComponent, openMenu: boolean) {
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
        if (openMenu) {
          vm.changeStepNav(1);
        }

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
      vm.store.dispatch(closeLoading());
    }
  }

  /**
   * search feature/items in BDC-STAC
   */
  private async searchSamples(vm: SearchComponent, openMenu: boolean) {
    try {
      vm.store.dispatch(showLoading());

      // set FIRST DAY in start date and LAST DAY in last date
      const startDate = new Date(vm.searchObj['start_date'].setDate(1));
      const lastDate = new Date(vm.searchObj['last_date'].setDate(getLastDateMonth(new Date(vm.searchObj['last_date']))));
      const bbox = Object.values(vm.searchObj['bbox']);

      let query = `CQL_FILTER=BBOX(location,${bbox[2]},${bbox[1]},${bbox[3]},${bbox[0]})`;
      query += `AND start_date AFTER ${formatDateUSA(startDate)}T00:00:00`;
      query += `AND end_date BEFORE ${formatDateUSA(lastDate)}T23:59:00`;

      const response = await vm.ss.getSamples(query);
      if (response.features.length) {
        vm.store.dispatch(setSamples(response.features));
        vm.store.dispatch(setRangeTemporal([
          startDate,
          lastDate
        ]));
        if (openMenu) {
          vm.changeStepNav(2);
        }
      } else {
        vm.snackBar.open('SAMPLES NOT FOUND!', '', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: 'app_snack-bar-error'
        });
      }

    } catch (err) {
      vm.changeStepNav(0);
      vm.snackBar.open('INCORRECT SEARCH - SAMPLES!', '', {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: 'app_snack-bar-error'
      });

    } finally {
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
      this.searchObj['start_date'] = new Date(times[0]);
      this.searchObj['last_date'] = new Date(times[1]);
      // set collection types
      this.typesCollection = response.properties['bdc:time_aggregations'].filter(
        t => t.name !== 'SCENE' && t.name !== 'MERGED').map((t => t.name));
      // set bands
      this.bands = response.properties['bdc:bands'];
      // set wrs/grid
      this.grid = response['properties']['bdc:wrs'];
      // set temporal schema and temporal step if monthly
      this.tschema = response['properties']['bdc:tschema'];
      this.tstep = response['properties']['bdc:tstep'];

    } catch (_) {}
  }

  /**
   * initialize search in selected resources
   */
  public search() {
    console.log(this.formSearch)
    if (this.formSearch.status !== 'VALID') {
      this.changeStepNav(0);
      this.snackBar.open('Fill in all fields correctly!', '', {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: 'app_snack-bar-error'
      });

    } else {
      // this.store.dispatch(reset());
      const vm = this;
      let firstMenu = true;
      vm.products.forEach((product: any) => {
        const productObj = this.productsList.filter(p => p['title'] === product);
        productObj[0]['searchFunction'](vm, firstMenu);
        firstMenu = false;
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
  public previewBbox(bbox) {
    this.removeLayerBbox();
    const bounds: LatLngBoundsExpression = [
      [bbox.north, bbox.east],
      [bbox.south, bbox.west]
    ];
    const newLayers = rectangle(bounds, {
      color: '#666',
      weight: 1,
      interactive: false,
      className: 'previewBbox'
    });

    this.store.dispatch(setLayers([newLayers]));
    this.store.dispatch(setBbox(newLayers.getBounds()));
    this.store.dispatch(setPositionMap(newLayers.getBounds()));
  }

  /**
   * remove bounding box of the map
   */
  public removeLayerBbox() {
    this.store.dispatch(removeGroupLayer({
      key: 'className',
      prefix: 'previewBbox'
    }));
  }

  /**
   * return if exists all selected coordinates
   */
  public bboxNotEmpty(): boolean {
    return this.searchObj['bbox'].north && this.searchObj['bbox'].south && this.searchObj['bbox'].east && this.searchObj['bbox'].west;
  }
}
