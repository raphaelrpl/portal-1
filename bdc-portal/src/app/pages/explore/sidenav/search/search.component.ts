import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { SearchService } from './search.service';
import { ExploreState } from '../../explore.state';
import { formatDateUSA, getLastDateMonth } from 'src/app/shared/helpers/date';
import {
  showLoading, closeLoading, setLayers, setPositionMap,
  setRangeTemporal, setFeatures, setBands
} from '../../explore.action';
import { rectangle, LatLngBoundsExpression, Layer } from 'leaflet';
import { MatSnackBar } from '@angular/material';

/**
 * component to search data of the BDC project
 * * search => STAC and WMS
 */
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Output() stepToEmit = new EventEmitter();

  public productsList: object[];
  public products: string[];
  public collections: string[];
  public typeSearchRegion: string;
  public rangeTemporal: Date[];
  public typesCollection: string[];
  public searchObj: object;

  public filterTemporal: Date[];
  public rangeTemporalEnabled: Date[];
  public layers: Layer[];

  constructor(
    private ss: SearchService,
    private snackBar: MatSnackBar,
    private store: Store<ExploreState>) {
      this.store.pipe(select('explore')).subscribe(res => {
        if (res.layers) {
          this.layers = Object.values(res.layers).slice(0, (Object.values(res.layers).length - 1)) as Layer[];
        }
        if (res.bbox) {
          const bbox = Object.values(res.bbox);
          this.searchObj['bbox'] = {
            north: bbox[0]['lat'],
            south: bbox[1]['lat'],
            west: bbox[1]['lng'],
            east: bbox[0]['lng']
          };
        }
      });
    }

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
    this.typeSearchRegion = 'coordinates';
    this.rangeTemporal = [];
  }

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

  private async searchFeatures(vm: SearchComponent) {
    try {
      vm.store.dispatch(showLoading());

      // set FIRST DAY in start date and LAST DAY in last date
      const startDate = new Date(vm.searchObj['start_date'].setDate(1));
      const lastDate = new Date(vm.searchObj['last_date'].setDate(getLastDateMonth(new Date(vm.searchObj['last_date']))));

      const bbox = Object.values(vm.searchObj['bbox']);
      let query = `type=${vm.searchObj['types']}`;
      query += `&collections=${vm.searchObj['cube']}`;
      query += `&bbox=${bbox[3]},${bbox[0]},${bbox[2]},${bbox[1]}`;
      query += `&time=${formatDateUSA(startDate)}`;
      query += `/${formatDateUSA(lastDate)}`;
      query += `&limit=10000`;

      const response = await vm.ss.searchSTAC(query);
      if (response.features.length > 0) {
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
      this.typesCollection = response.properties['bdc:time_aggregations'].filter(t => t.name !== "SCENE" && t.name !== "MERGED").map((t => t.name));
      // set bands
      this.store.dispatch(setBands(response.properties['bdc:bands']));

    } catch (_) {}
  }

  public search() {
    const vm = this;
    this.products.forEach((product: any) => {
      const productObj = this.productsList.filter(p => p['title'] === product);
      productObj[0]['searchFunction'](vm);
    });
  }

  public changeStepNav(step) {
    this.stepToEmit.emit(step);
  }

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

  public removeLayerBbox() {
    this.layers = this.layers.filter( lyr => lyr['options'].className !== 'previewBbox');
    this.store.dispatch(setLayers(this.layers));
  }

  public bboxNotEmpty(): boolean {
    return this.searchObj['bbox'].north && this.searchObj['bbox'].south && this.searchObj['bbox'].east && this.searchObj['bbox'].west;
  }
}
