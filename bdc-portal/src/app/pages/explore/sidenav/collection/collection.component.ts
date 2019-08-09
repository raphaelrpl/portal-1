import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Feature } from './collection.interface';
import { ExploreState } from '../../explore.state';
import { imageOverlay,  Layer, geoJSON } from 'leaflet';
import { setLayers, setPositionMap, setFeatures } from '../../explore.action';
import { MatSnackBar, MatDialog } from '@angular/material';
import { DialogFeatureComponent } from 'src/app/shared/components/dialog-feature/dialog-feature.component';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent {

  public features$: Feature[] = [];
  public layers: Layer[];
  private bands: string[];

  constructor(public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private store: Store<ExploreState>) {
    this.store.pipe(select('explore')).subscribe(res => {
      if (res.features) {
        this.features$ = <Feature[]>Object.values(res.features).slice(0, (Object.values(res.features).length-1));
      }

      if (res.layers) {
        this.layers = <Layer[]>Object.values(res.layers).slice(0, (Object.values(res.layers).length-1));
      }

      if (res.bands) {
        this.bands = <string[]>Object.values(res.bands).slice(0, (Object.values(res.bands).length-1));
      }
    });
  }

  public getDateFormated(dateStr: string) {
    let dates = dateStr.split('/');
    let startDate = (new Date(dates[0])).toLocaleDateString();
    return `${startDate}`;
  }

  public onChangeLayer(event, feature: any) {
    if (event.checked) {
      this.features$ = this.features$.map( f => {
        if (f.id == feature.id) {
          f['enabled'] = true;
        }
        return f;
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
      this.features$ = this.features$.map( f => {
        if (f.id == feature.id) {
          f['enabled'] = false;
        }
        return f;
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

  public setZoom(feature: any) {
    const featureGeoJson = geoJSON(feature);
    const bounds = featureGeoJson.getBounds();
    this.store.dispatch(setPositionMap(bounds));
  }

  public enableActions(featureId: string) {
    this.features$ = this.features$.map( f => {
      if (f.id == featureId) {
        f['actions'] = !(f['actions'] === true)
      }
      return f
    })
    this.store.dispatch(setFeatures(this.features$));
  }

  public viewFeatureDetails(feature: Feature){
    const dialogRef = this.dialog.open(DialogFeatureComponent, {
      width: '600px',
      data: {...feature, bands: this.bands}
    });
  }
}
