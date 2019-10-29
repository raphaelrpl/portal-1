import { Component, Input} from '@angular/core';
import * as L from 'leaflet';
import 'src/assets/plugins/Leaflet.ImageTransform/leafletImageTransform.js';

import { setLayers, removeGroupLayer, setPositionMap } from 'src/app/pages/explore/explore.action';
import { ExploreState } from 'src/app/pages/explore/explore.state';
import { Store } from '@ngrx/store';
import { CatalogService } from '../../catalog.service';
import { MatSnackBar } from '@angular/material';
import { showLoading, closeLoading } from 'src/app/app.action';
import { AuthState } from 'src/app/pages/auth/auth.state';

/** Map Results Catalog component
 * component to display images of the catalog
 */
@Component({
  selector: 'app-results-catalog',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class CatalogResultsComponent {

  /** features seleted */
  @Input('features') public features;

  /** images cataloged  */
  @Input('itemsCatalog') public itemsCatalog;

  /** if POST permission - in download  */
  @Input('authPOST') public authPOST;

  /** count of result per page */
  public perPage = 10;
  /** page selected */
  public page = 1;

  /** import store explore */
  constructor(
    private cs: CatalogService,
    private snackBar: MatSnackBar,
    private storeApp: Store<AuthState>,
    private store: Store<ExploreState>) {}

  /** convert date to USA format */
  public getDateFormated(dateStr: string): string {
    const dates = dateStr.split('/');
    const startDate = (new Date(dates[0])).toLocaleDateString();
    return `${startDate}`;
  }

  /** cut word at max requested */
  public getStringMax(word: string, max: number): string {
    return word.length <= max ? word : word.substr(0, max) + '...';
  }

  /**
   * enable or disable actions box in the feature
   */
  public enableFeatureActions(featureId: string) {
    this.features = this.features.map( f => {
      if (f.id === featureId) {
        f['actions'] = !(f['actions'] === true);
      }
      return f;
    });
  }

  /**
   * enable and disabled feature of the map
   */
  public onChangeLayer(event, feature: any) {
    if (event.checked) {
      this.features = this.features.map( f => {
        if (f.id === feature.id) {
          f['enabled'] = true;
        }
        return f;
      });

      if (feature.properties['bdc:time_aggregation']) {
        // if provider = BDC_STAC
        const coordinates = feature.geometry.coordinates[0];
        // [lat, lng] => TL, TR, BR, BL
        const anchor = [
          [coordinates[0][1], coordinates[0][0]],
          [coordinates[3][1], coordinates[3][0]],
          [coordinates[2][1], coordinates[2][0]],
          [coordinates[1][1], coordinates[1][0]]
        ];
        const layerTile = (L as any).imageTransform(feature.assets.thumbnail.href, anchor, {
          alt: `catalog_${feature.id}`,
          interactive: true
        });
        this.store.dispatch(setLayers([layerTile]));

      } else {
        // if provider != BDC_STAC
        const feat = L.geoJSON(feature);
        const layerTile = new L.ImageOverlay(feature.assets.thumbnail.href, feat.getBounds(), {
          alt: `catalog_${feature.id}`,
          interactive: true
        });
        this.store.dispatch(setLayers([layerTile]));
      }

    } else {
      this.features = this.features.map( f => {
        if (f.id === feature.id) {
          f['enabled'] = false;
        }
        return f;
      });

      this.store.dispatch(removeGroupLayer({
        key: 'alt',
        prefix: `catalog_${feature.id}`
      }));
    }
  }

  /**
   * set zoom in the feature/item of the map
   */
  public setZoomByFeature(feature: any) {
    const featureGeoJson = L.geoJSON(feature);
    const bounds = featureGeoJson.getBounds();
    this.store.dispatch(setPositionMap(bounds));
  }

  /**
   * check if the image is cataloged (Sentinel or Landsat)
   */
  public verifyCataloged(feature) {
    const instrument = feature['properties']['eo:instrument'];
    if (instrument && (instrument.indexOf('MSI') >= 0 || instrument.indexOf('OLI') >= 0)) {
      const sat = instrument.indexOf('MSI') >= 0 ? 'sentinel' : 'landsat';
      const filter = this.itemsCatalog.filter( (item: string) => {
        const productId = feature['properties'][`${sat}:product_id`];
        return (
          item.split('_')[0] === productId.split('_')[0] &&
          item.split('_')[2] === productId.split('_')[2] &&
          (sat === 'sentinel' ? item.split('_')[5] === productId.split('_')[5] : item.split('_')[5] === productId.split('_')[5])
        );
      });
      return filter.length > 0;

    } else {
      return true;
    }
  }

  /**
   * dispatch download and publish of the feature/image
   */
  public async downloadFeature(feature: any) {
    try {
      this.storeApp.dispatch(showLoading());
      let query = `satsen=${feature['properties']['eo:platform'].indexOf('sentinel') >= 0 ? 'S2' : 'LC8'}`;
      query += `&start=${feature['properties']['datetime'].split('T')[0]}`;
      query += `&end=${feature['properties']['datetime'].split('T')[0]}`;
      query += `&cloud=${parseInt(feature['properties']['eo:cloud_cover']) + 1}`;
      query += `&w=${feature['bbox'][0]}`;
      query += `&s=${feature['bbox'][1]}`;
      query += `&n=${feature['bbox'][3]}`;
      query += `&e=${feature['bbox'][2]}`;

      const response = await this.cs.downloadImagesCatalog(query);
      if (response) {
        this.snackBar.open('Download Started!', '', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: 'app_snack-bar-success'
        });
      } else {
        throw new Error('');
      }

    } catch (err) {
      this.snackBar.open('Error in start download!', '', {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: 'app_snack-bar-error'
      });

    } finally {
      this.storeApp.dispatch(closeLoading());
    }
  }
}
