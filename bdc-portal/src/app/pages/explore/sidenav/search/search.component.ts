import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { SearchService } from './search.service';
import { ExploreState } from '../../explore.state';
// import { Collection } from '../collection/collection.interface';
// import { CollectionsAction } from '../../explore.action';

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

  private products: string[];
  private providersList: object;
  public productsList: Object[];
  public providersKeys: string[];
  public typeSearchRegion: string;
  public searchObj: Object;
  public rangeTemporal: Date[];

  constructor(private ss: SearchService, private store: Store<ExploreState>) {}

  ngOnInit() {
    // this.store.dispatch(new CollectionsAction([{
    //     id: '11122',
    //     name: 'na1me-layer'
    //   }]
    // ));

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
      const bbox = Object.values(vm.searchObj['bbox'])
      let query = `providers=${vm.searchObj['providers'].join(',')}`;
      query += `&bbox=${bbox[3]},${bbox[2]},${bbox[1]},${bbox[0]}`;
      query += `&cloud=${vm.searchObj['cloud']}`;
      query += `&start_date=${vm.formatDateUSA(vm.searchObj['start_date'])}`;
      query += `&last_date=${vm.formatDateUSA(vm.searchObj['last_date'])}`;

      const response = await vm.ss.searchCollections(query);
      console.log(response)

    } catch(err) {
      console.log('==> ERR: ' + err);
    }
  }

  // TODO: move to utils
  private formatDateUSA(date: Date) {
    let month: string = (date.getMonth()+1).toString()
    month = month.toString().length == 1 ? `0${month}`: month
    let day: string = (date.getDate()).toString()
    day = day.toString().length == 1 ? `0${day}`: day

    return `${date.getFullYear()}-${month}-${day}`
  }
}
