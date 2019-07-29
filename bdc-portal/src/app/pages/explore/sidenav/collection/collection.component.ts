import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Collection } from './collection.interface';
import { ExploreState } from '../../explore.state';
import { tileLayer } from 'leaflet';
import { setLayers, addLayer } from '../../explore.action';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent {

  public collections$: Collection[] = [];

  constructor(private store: Store<ExploreState>) {
    this.store.pipe(select('explore')).subscribe(res => {
      if (res.collections) {
        this.collections$ = <Collection[]>Object.values(res.collections).slice(0, (Object.values(res.collections).length-1));
      }
    });
  }

  getDateFormated(dateStr: string) {
    let dates = dateStr.split('/');
    let startDate = (new Date(dates[0])).toLocaleDateString();
    return `${startDate}`;
  }

  enable_layer(path_ql) {
    const newLayer = tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    this.store.dispatch(addLayer(newLayer))
  }

}
