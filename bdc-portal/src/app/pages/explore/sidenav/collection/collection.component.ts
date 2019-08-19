import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Feature } from './collection.interface';
import { ExploreState } from '../../explore.state';
import { imageOverlay,  Layer, geoJSON, featureGroup } from 'leaflet';
import { setLayers, setPositionMap, setFeaturesPeriod, setOpacity } from '../../explore.action';
import { MatSnackBar, MatDialog } from '@angular/material';
import { DialogFeatureComponent } from 'src/app/shared/components/dialog-feature/dialog-feature.component';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent {

  public features$: Feature[] = [];
  public featuresPeriod$: Feature[] = [];
  public layers: Layer[];
  public period: Number;
  public opacity = 10;
  public opacityEnabled = false;
  private bands: string[];
  private range: Date[];

  constructor(public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private store: Store<ExploreState>) {
    this.store.pipe(select('explore')).subscribe(res => {
      if (res.features) {
        this.features$ = Object.values(res.features).slice(0, (Object.values(res.features).length - 1)) as Feature[];
      }
      if (res.featuresPeriod) {
        this.featuresPeriod$ = Object.values(res.featuresPeriod).slice(0, (Object.values(res.featuresPeriod).length - 1)) as Feature[];
      }
      if (res.layers) {
        this.layers = Object.values(res.layers).slice(0, (Object.values(res.layers).length - 1)) as Layer[];
      }
      if (res.bands) {
        this.bands = Object.values(res.bands).slice(0, (Object.values(res.bands).length - 1)) as string[];
      }
      if (Object.values(res.rangeTemporal).length) {
        this.range = Object.values(res.rangeTemporal);
      }
    });
  }

  public getDateFormated(dateStr: string) {
    const dates = dateStr.split('/');
    const startDate = (new Date(dates[0])).toLocaleDateString();
    return `${startDate}`;
  }

  public onChangeLayer(event) {
    if (event.checked) {
      this.featuresPeriod$ = this.featuresPeriod$.map( (f: any) => {
        const featureGeoJson = geoJSON(f);
        const bounds = featureGeoJson.getBounds();
        this.layers.push(imageOverlay(f.assets.thumbnail.href, bounds, {
          alt: `qls_${f.id}`
        }).setZIndex(999));

        return {...f, enabled: true};
      });

      this.store.dispatch(setLayers(this.layers));
      this.snackBar.open('LAYERS ENABLED!', '', {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: 'app_snack-bar-success'
      });

    } else {
      this.featuresPeriod$ = this.featuresPeriod$.map( f => {
        return {...f, enabled: false};
      });

      const newLayers = this.layers.filter( lyr => !lyr['options'].alt || (lyr['options'].alt && lyr['options'].alt.indexOf('qls_') < 0) );
      this.store.dispatch(setLayers(newLayers));
      this.snackBar.open('LAYERS DISABLED!', '', {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: 'app_snack-bar-success'
      });
    }
  }

  public setZoomByFeature(feature: any) {
    const featureGeoJson = geoJSON(feature);
    const bounds = featureGeoJson.getBounds();
    this.store.dispatch(setPositionMap(bounds));
  }

  public setZoomByCube() {
    const featuresGeoJson = featureGroup(this.featuresPeriod$.map((f: any) => geoJSON(f)));
    const bounds = featuresGeoJson.getBounds();
    this.store.dispatch(setPositionMap(bounds));
  }

  public viewOpacityCube() {
    this.opacityEnabled = !this.opacityEnabled;
  }

  public setOpacityCube() {
    const newOpacity = (this.opacity/10).toString();
    this.store.dispatch(setOpacity({opacity: newOpacity}));
  }

  public enableFeatureActions(featureId: string) {
    this.featuresPeriod$ = this.featuresPeriod$.map( f => {
      if (f.id === featureId) {
        f['actions'] = !(f['actions'] === true);
      }
      return f;
    });
    this.store.dispatch(setFeaturesPeriod(this.featuresPeriod$));
  }

  public viewFeatureDetails(feature: Feature) {
    this.dialog.open(DialogFeatureComponent, {
      width: '600px',
      height: '550px',
      data: {
        feature: feature,
        bands: this.bands
      }
    });
  }

  public viewCubeDetails() {
    this.dialog.open(DialogFeatureComponent, {
      width: '600px',
      data: {
        features: this.features$,
        bands: this.bands,
        range: this.range
      }
    });
  }
}
