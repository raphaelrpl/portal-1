import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { SearchService } from './search.service';
import { ExploreState } from '../../explore.state';
import { formatDateUSA } from 'src/app/shared/helpers/date';
import { setCollections, showLoading, closeLoading, setLayers, setPositionMap, setRangeTemporal } from '../../explore.action';
import { rectangle, LatLngBoundsExpression, Layer } from 'leaflet';
import { Collection, Feature } from '../collection/collection.interface';
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

  private products: string[];
  public productsList: Object[];
  public providers: string[];
  public typeSearchRegion: string;
  public searchObj: Object;
  public rangeTemporal: Date[];
  public filterTemporal: Date[];
  public rangeTemporalEnabled: Date[];
  public layers: Layer[];

  constructor(
    private ss: SearchService,
    private _snackBar: MatSnackBar,
    private store: Store<ExploreState>) {
      this.store.pipe(select('explore')).subscribe(res => {
        if (res.layers) {
          this.layers = <Layer[]>Object.values(res.layers).slice(0, (Object.values(res.layers).length-1));
        }
        if (res.bbox) {
          const bbox = Object.values(res.bbox)
          this.searchObj['bbox'] = {
            'north': bbox[0]['lat'],
            'south': bbox[1]['lat'],
            'west': bbox[1]['lng'],
            'east': bbox[0]['lng']
          }
        }
      });
    }

  ngOnInit() {
    this.productsList = [
      {
        'title': 'collections',
        'disabled': false,
        'searchFunction': this.searchCollections
      }, {
        'title': 'samples',
        'disabled': true
      }, {
        'title': 'classification',
        'disabled': true
      }
    ]

    this.getProviders();
    this.resetSearch();
    this.typeSearchRegion = 'coordinates';
    this.rangeTemporal = [
      new Date(2016, 8, 1),
      new Date()
    ]
  }

  private async getProviders() {
    try {
      const response = await this.ss.getProviders();
      this.providers = Object.keys(response.providers);
    } catch(err) {
      console.log('==> ERR: ' + err);
    }
  }

  private async searchCollections(vm: SearchComponent) {
    try {
      vm.store.dispatch(showLoading());

      const bbox = Object.values(vm.searchObj['bbox']);
      let query = `providers=${vm.searchObj['providers'].join(',')}`;
      query += `&bbox=${bbox[3]},${bbox[0]},${bbox[2]},${bbox[1]}`;
      query += `&cloud=${vm.searchObj['cloud']}`;
      query += `&start_date=${formatDateUSA(vm.rangeTemporalEnabled[0])}`;
      query += `&last_date=${formatDateUSA(vm.rangeTemporalEnabled[1])}`;

      const response = await vm.ss.searchCollections(query);
      if (response.length > 0) {
        const features: Feature[] = Object.values(response);
        let collections: Collection[] = []

        //grouping features by collectionsss
        features.forEach((feat: Feature) => {
          const collectionName = feat['collection'];
          if (collections.filter( coll => coll.name == collectionName).length > 0) {
            const clts: Collection[] = []
            collections.forEach((c: Collection) => {
              if (c.name == collectionName) {
                c.features.push(feat);
              }
              clts.push(c);
            });
            collections = clts;
          } else {
            collections.push({
              'name': collectionName,
              'features': [feat]
            })
          }
        })
        vm.store.dispatch(setCollections(collections));
        vm.changeStepNav(1);

      } else {
        vm.store.dispatch(setCollections([]));
        vm.changeStepNav(0);
        vm._snackBar.open('RESULTS NOT FOUND!', '', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: 'app_snack-bar-error'
        });
      }

    } catch(err) {
    } finally {
      const newLayers = vm.layers.filter( lyr => !lyr['options'].alt || (lyr['options'].alt && lyr['options'].alt.indexOf('qls_') < 0))
      vm.store.dispatch(setLayers(newLayers));
      vm.store.dispatch(closeLoading());
    }
  }

  private resetSearch() {
    this.searchObj = {
      'providers': [],
      'bbox': {
        'north': null,
        'south': null,
        'west': null,
        'east': null
      },
      'cloud': null,
      'step': null,
      'start_date': '',
      'last_date': ''
    }
  }

  public search() {
    const vm = this
    this.products.forEach((product: any) => {
      const productObj = this.productsList.filter(p => p['title'] == product);

      if (product == 'collections') {
        //set period filtered
        vm.store.dispatch(setRangeTemporal([
          new Date(vm.searchObj['start_date']),
          new Date(vm.searchObj['last_date'])
        ]));

        //set dates of first period
        const lastDate = new Date(vm.searchObj['start_date']);
        lastDate.setDate(lastDate.getDate() + parseInt(vm.searchObj['step']));
        vm.rangeTemporalEnabled = [
          new Date(vm.searchObj['start_date']),
          lastDate
        ]
        productObj[0]['searchFunction'](vm);

      } else {
        productObj[0]['searchFunction'](vm);
      }
    });
  }

  public changeStepNav(step) {
    this.stepToEmit.emit(step);
  }

  public previewBbox() {
    this.removeLayerBbox()
    const bounds: LatLngBoundsExpression = [
      [this.searchObj['bbox'].north, this.searchObj['bbox'].east],
      [this.searchObj['bbox'].south, this.searchObj['bbox'].west]
    ];
    const newLayers = rectangle(bounds, {
      color: "#666",
      weight: 1,
      className: 'previewBbox'
    }).bringToFront();

    this.layers.push(newLayers);
    this.store.dispatch(setLayers(this.layers));
    this.store.dispatch(setPositionMap(newLayers.getBounds()));
  }

  public removeLayerBbox() {
    this.layers = this.layers.filter( lyr => lyr['options'].className != 'previewBbox');
    this.store.dispatch(setLayers(this.layers));
  }

  public bboxNotEmpty(): boolean {
    return this.searchObj['bbox'].north && this.searchObj['bbox'].south && this.searchObj['bbox'].east && this.searchObj['bbox'].west
  }
}
