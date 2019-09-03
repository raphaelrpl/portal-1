import { Component, Input} from '@angular/core';
import * as L from 'leaflet';
import 'src/assets/plugins/Leaflet.ImageTransform/leafletImageTransform.js';

import { setLayers, removeGroupLayer, setPositionMap } from 'src/app/pages/explore/explore.action';
import { ExploreState } from 'src/app/pages/explore/explore.state';
import { Store } from '@ngrx/store';

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

  /** count of result per page */
  public perPage = 10;
  /** page selected */
  public page = 1;

  /** import store explore */
  constructor(private store: Store<ExploreState>) {}

  /** convert date to USA format */
  public getDateFormated(dateStr: string): string {
    const dates = dateStr.split('/');
    const startDate = (new Date(dates[0])).toLocaleDateString();
    return `${startDate}`;
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
}
