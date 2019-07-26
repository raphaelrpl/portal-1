import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';

import { SearchService } from './search.service';
import { ExploreState } from '../../explore.state';
import { formatDateUSA } from 'src/app/shared/helpers/date';
import { collections, showLoading, closeLoading } from '../../explore.action';

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

  constructor(
    private ss: SearchService,
    private store: Store<ExploreState>) { }

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
      'start_date': '',
      'last_date': ''
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

      const bbox = Object.values(vm.searchObj['bbox'])
      let query = `providers=${vm.searchObj['providers'].join(',')}`;
      query += `&bbox=${bbox[3]},${bbox[2]},${bbox[1]},${bbox[0]}`;
      query += `&cloud=${vm.searchObj['cloud']}`;
      query += `&start_date=${formatDateUSA(vm.searchObj['start_date'])}`;
      query += `&last_date=${formatDateUSA(vm.searchObj['last_date'])}`;

      const response = await vm.ss.searchCollections(query);
      vm.store.dispatch(collections(Object.values(response['providers'])));
      vm.changeStepNav(1)

    } catch(err) {
      console.log('==> ERR: ' + err);

    } finally {
      vm.store.dispatch(closeLoading());
    }
  }

  changeStepNav(step) {
    this.stepToEmit.emit(step);
  }
}
