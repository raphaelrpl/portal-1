import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { SearchService } from './search.service';
import { ExploreState } from '../../explore.state';
import { formatDateUSA } from 'src/app/shared/helpers/date';
import { collections, showLoading, closeLoading, setLayers, setPositionMap } from '../../explore.action';
import { rectangle, LatLngBoundsExpression, Layer } from 'leaflet';

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
  private providersList: object;
  public productsList: Object[];
  public providersKeys: string[];
  public typeSearchRegion: string;
  public searchObj: Object;
  public rangeTemporal: Date[];
  public layers: Layer[];

  constructor(
    private ss: SearchService,
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
      const response = await this.ss.getProviders()
      this.providersList = response.providers
      this.providersKeys = Object.keys(this.providersList)

    } catch(err) {
      console.log('==> ERR: ' + err);
    }
  }

  public search() {
    const vm = this
    this.products.forEach((product: any) => {
      const productObj = this.productsList.filter(p => p['title'] == product)
      productObj[0]['searchFunction'](vm)
    });
  }

  private async searchCollections(vm: SearchComponent) {
    try {
      vm.store.dispatch(showLoading());

      const bbox = Object.values(vm.searchObj['bbox']);
      const lastDate = new Date(vm.searchObj['start_date']);
      lastDate.setDate(lastDate.getDate() + parseInt(vm.searchObj['step']))
      let query = `providers=${vm.searchObj['providers'].join(',')}`;
      query += `&bbox=${bbox[3]},${bbox[2]},${bbox[1]},${bbox[0]}`;
      query += `&cloud=${vm.searchObj['cloud']}`;
      query += `&start_date=${formatDateUSA(vm.searchObj['start_date'])}`;
      query += `&last_date=${formatDateUSA(lastDate)}`;

      const response = await vm.ss.searchCollections(query);
      console.log(response)
      if (response['providers'].length > 0) {
        vm.store.dispatch(collections(Object.values(response['providers'])));
        vm.changeStepNav(1);
      } else {
        vm.store.dispatch(collections([]));
        vm.changeStepNav(0);
      }

    } catch(err) {
      console.log('==> ERR: ' + err);

    } finally {
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
    });

    this.layers.push(newLayers);
    this.store.dispatch(setLayers(this.layers));
    this.store.dispatch(setPositionMap(newLayers.getBounds()));

  }

  public removeLayerBbox() {
    this.layers = this.layers.filter( lyr => lyr['options'].className != 'previewBbox');
    this.store.dispatch(setLayers(this.layers));
  }

  public bboxNotEmpty() {
    return this.searchObj['bbox'].north && this.searchObj['bbox'].south && this.searchObj['bbox'].east && this.searchObj['bbox'].west
  }
}
