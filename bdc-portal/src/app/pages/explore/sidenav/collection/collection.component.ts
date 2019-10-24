import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import * as L from 'leaflet';
import 'src/assets/plugins/Leaflet.ImageTransform/leafletImageTransform.js';

import { Feature } from './collection.interface';
import { ExploreState } from '../../explore.state';
import { geoJSON, featureGroup } from 'leaflet';
import { setLayers, setPositionMap, setFeaturesPeriod, removeGroupLayer, setEditFeature } from '../../explore.action';
import { MatSnackBar, MatDialog } from '@angular/material';
import { DialogFeatureComponent } from 'src/app/shared/components/dialog-feature/dialog-feature.component';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent {

  /** all selected features in the search form */
  public features: Feature[] = [];
  /** features by selected period */
  public featuresPeriod: Feature[] = [];
  /** selected period in the slider */
  public period: number;
  /** list of bands */
  private bands: string[];
  /** range with dates (start-end) of the selected period */
  private range: Date[];

  private urlBDCTiler = window['__env'].urlBDCTiler;

  /** get infos by store application */
  constructor(public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private store: Store<ExploreState>) {
    this.store.pipe(select('explore')).subscribe(res => {
      if (res.features) {
        this.features = Object.values(res.features).slice(0, (Object.values(res.features).length - 1)) as Feature[];
      }
      if (res.featuresPeriod) {
        this.featuresPeriod = Object.values(res.featuresPeriod).slice(0, (Object.values(res.featuresPeriod).length - 1)) as Feature[];
      }
      if (res.bands) {
        this.bands = Object.values(res.bands).slice(0, (Object.values(res.bands).length - 1)) as string[];
      }
      if (Object.values(res.rangeTemporal).length) {
        this.range = Object.values(res.rangeTemporal);
      }
    });
  }

  /** convert date to USA format */
  public getDateFormated(dateStr: string): string {
    const dates = dateStr.split('/');
    const startDate = (new Date(dates[0])).toLocaleDateString();
    return `${startDate}`;
  }

  /**
   * enable or disable cube in the map
   */
  public onChangeLayer(event) {
    if (event.checked) {
      const bands = "red,green,blue";
      const color_formula = "Gamma RGB 4.5 Saturation 2 Sigmoidal RGB 10 0.35";

      this.featuresPeriod = this.featuresPeriod.map( (f: any) => {
        let url = `${this.urlBDCTiler}/${f.id}/{z}/{x}/{y}.png`;
        url += `?bands=${bands}&color_formula=${color_formula}`;
        const layerTile = new L.TileLayer(url, {
          className: `cube_${f.id}`,
          attribution: `Brazil Data Cube`
        });

        this.store.dispatch(setLayers([layerTile]));
        return {...f, enabled: true};
      });

      this.snackBar.open('LAYERS ENABLED!', '', {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: 'app_snack-bar-success'
      });

      setTimeout( _ => {
        this.store.dispatch(setFeaturesPeriod(this.featuresPeriod));
      });

    } else {
      this.featuresPeriod = this.featuresPeriod.map( f => {
        return {...f, enabled: false};
      });

      this.store.dispatch(removeGroupLayer({
        key: 'className',
        prefix: 'cube_'
      }));
      this.snackBar.open('LAYERS DISABLED!', '', {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: 'app_snack-bar-success'
      });
    }
  }

  /**
   * set zoom in the feature/item of the map
   */
  public setZoomByFeature(feature: any) {
    const featureGeoJson = geoJSON(feature);
    const bounds = featureGeoJson.getBounds();
    this.store.dispatch(setPositionMap(bounds));
  }

  /**
   * set zoom in the Cube of the map
   */
  public setZoomByCube() {
    const featuresGeoJson = featureGroup(this.featuresPeriod.map((f: any) => geoJSON(f)));
    const bounds = featuresGeoJson.getBounds();
    this.store.dispatch(setPositionMap(bounds));
  }

  /**
   * enable or disable actions box in the feature
   */
  public enableFeatureActions(featureId: string) {
    this.featuresPeriod = this.featuresPeriod.map( f => {
      if (f.id === featureId) {
        f['actions'] = !(f['actions'] === true);
      }
      return f;
    });
    this.store.dispatch(setFeaturesPeriod(this.featuresPeriod));
  }

  /**
   * open dialog with features infos
   */
  public viewFeatureDetails(feature: Feature) {
    this.dialog.open(DialogFeatureComponent, {
      width: '600px',
      height: '550px',
      data: {
        feature,
        bands: this.bands
      }
    });
  }

  /**
   * open dialog with Cube infos
   */
  public viewCubeDetails() {
    this.dialog.open(DialogFeatureComponent, {
      width: '600px',
      data: {
        features: this.features,
        bands: this.bands,
        range: this.range
      }
    });
  }

  /**
   * enable edit box to feature
   */
  public setColors(feature) {
    this.store.dispatch(setEditFeature(feature));
  }
}
