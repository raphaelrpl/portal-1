import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Collection } from './collection.interface';
import { ExploreState } from '../../explore.state';
import { imageOverlay,  Layer, geoJSON } from 'leaflet';
import { setLayers, setPositionMap } from '../../explore.action';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent {

  public collections$: Collection[] = [];
  public layers: Layer[];

  constructor(private store: Store<ExploreState>) {
    this.store.pipe(select('explore')).subscribe(res => {
      if (res.collections) {
        this.collections$ = <Collection[]>Object.values(res.collections).slice(0, (Object.values(res.collections).length-1));
      }
    });

    this.store.pipe(select('explore')).subscribe(res => {
      if (res.layers) {
        this.layers = <Layer[]>Object.values(res.layers).slice(0, (Object.values(res.layers).length-1));
      }
    });
  }

  getDateFormated(dateStr: string) {
    let dates = dateStr.split('/');
    let startDate = (new Date(dates[0])).toLocaleDateString();
    return `${startDate}`;
  }

  // onChangeLayer(event, feature: any) {
  //   if (event.checked) {
  //     this.collections$ = this.collections$.map( c => {
  //       if (c.id == feature.id) {
  //         c['enabled'] = true;
  //       }
  //       return c;
  //     })

  //     const featureGeoJson = geoJSON(feature);
  //     const bounds = featureGeoJson.getBounds();
  //     const newlayer = imageOverlay(feature.assets.thumbnail.href, bounds, {
  //       'alt': feature.id
  //     });
  //     this.layers.push(newlayer);
  //     this.store.dispatch(setLayers(this.layers));

  //   } else {
  //     this.collections$ = this.collections$.map( c => {
  //       if (c.id == feature.id) {
  //         c['enabled'] = false;
  //       }
  //       return c;
  //     })

  //     const newLayers = this.layers.filter( lyr => lyr['options'].alt != feature.id);
  //     this.store.dispatch(setLayers(newLayers));
  //   }
  // }

  setZoom(feature: any) {
    const featureGeoJson = geoJSON(feature);
    const bounds = featureGeoJson.getBounds();
    this.store.dispatch(setPositionMap(bounds));
  }

  // enableActions(featureId: string) {
  //   this.collections$ = this.collections$.map( c => {
  //     if (c.id == featureId) {
  //       c['actions'] = !(c['actions'] === true)
  //     }
  //     return c
  //   })
  // }

}
