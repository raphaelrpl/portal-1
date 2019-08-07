import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Collection } from './collection.interface';
import { ExploreState } from '../../explore.state';
import { imageOverlay,  Layer, geoJSON } from 'leaflet';
import { setLayers, setPositionMap, setCollections } from '../../explore.action';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent {

  public collections$: Collection[] = [];
  public layers: Layer[];

  constructor(private _snackBar: MatSnackBar,
    private store: Store<ExploreState>) {
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

  onChangeLayer(event, collectionName: string, feature: any) {
    if (event.checked) {
      this.collections$ = this.collections$.map( c => {
        if (c.name == collectionName) {
          return {...c, features: c.features.map( f => {
            if (f.id == feature.id) {
              f['enabled'] = true;
            }
            return f;
          })}
        } else {
          return c;
        }
      })

      const featureGeoJson = geoJSON(feature);
      const bounds = featureGeoJson.getBounds();
      const newlayer = imageOverlay(feature.assets.thumbnail.href, bounds, {
        'alt': `qls_${feature.id}`
      }).setZIndex(999);

      this.layers.push(newlayer);
      this.store.dispatch(setLayers(this.layers));
      this._snackBar.open('LAYER ENABLED!', '', {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: 'app_snack-bar-success'
      });

    } else {
      this.collections$ = this.collections$.map( c => {
        if (c.name == collectionName) {
          return {...c, features: c.features.map( f => {
            if (f.id == feature.id) {
              f['enabled'] = false;
            }
            return f;
          })}
        } else {
          return c;
        }
      })

      const newLayers = this.layers.filter( lyr => lyr['options'].alt != `qls_${feature.id}` );
      this.store.dispatch(setLayers(newLayers));
      this._snackBar.open('LAYER DISABLED!', '', {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: 'app_snack-bar-success'
      });
    }
  }

  setZoom(feature: any) {
    const featureGeoJson = geoJSON(feature);
    const bounds = featureGeoJson.getBounds();
    this.store.dispatch(setPositionMap(bounds));
  }

  enableFeatures(collectionName: string) {
    this.collections$ = this.collections$.map( c => {
      if (c.name == collectionName) {
        return {...c, viewFeatures: !c['viewFeatures']}
      } else {
        return c
      }
    })
    this.store.dispatch(setCollections(this.collections$));
  }

  enableActions(collectionName: string, featureId: string) {
    this.collections$ = this.collections$.map( c => {
      if (c.name == collectionName) {
        return {...c, features: c.features.map( f => {
          if (f.id == featureId) {
            f['actions'] = !(f['actions'] === true)
          }
          return f
        })}
      } else {
        return c
      }
    })
    this.store.dispatch(setCollections(this.collections$));
  }

}
