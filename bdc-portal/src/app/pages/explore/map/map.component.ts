import { Component, OnInit, Input } from '@angular/core';
import { latLng, MapOptions, Layer, geoJSON } from 'leaflet';
import { GeoJsonObject } from 'geojson';

import { BdcLayer, BdcLayerWFS } from './layers/layer.interface';
import { LayerService } from './layers/layer.service';

/**
 * Map component
 * component to manage and initialize map in explore page
 */
@Component({
  selector: 'app-base-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  /** props with width of the map */
  @Input() width: number;
  /** props with height of the map */
  @Input() height: number;

  /** object with map settings */
  public options: MapOptions;
  /** layers displayed on the Leaflet control component */
  public layersControl: any;
  /** visible layers in the map */
  public layers: Layer[];
  /** all overlay layers read and mounted */
  private overlayers: BdcLayer[];

  /** all available base layers for viewing (layer object only) */
  private baseLayers = {};
  /** all overlay layers available for viewing (layer object only) */
  private overlays = {};

  /** start Layer Service */
  constructor(private ls: LayerService) {}

  /** set layers and initial configuration of the map */
  ngOnInit() {
    this.options = {
      zoom: 5,
      center: latLng(-16, -52)
    };

    this.setBaseLayers(this.ls.getBaseLayers());
    this.setGridsLayers(this.ls.getGridsLayers());
  }

  /** set the visible layers in the layer component of the map */
  setControlLayers(): void {
    this.layersControl = {
      baseLayers: this.baseLayers,
      overlays: this.overlays
    };
  }

  /**
   * get the layer objects from a list of BdcLayer
   * @params {list} list of BdcLayer with the external base Layers
   */
  setBaseLayers(listLayers: BdcLayer[]) {
    const vm = this;
    listLayers.forEach( (l: BdcLayer) => {
      vm.baseLayers[l.name] = l.layer;
    });
  }

  /**
   * get the layer objects from a list of BdcLayerWFS
   * mount the overlayers with GeoJson's consulted from the Geoserver
   * @params {list} list of BdcLayerWFS with the grids of the BDC project
   */
  async setGridsLayers(listLayersId: BdcLayerWFS[]) {
    try {
      const vm = this;
      this.overlayers = [];

      await listLayersId.forEach( async (l: BdcLayerWFS) => {
        const responseGeoJson: GeoJsonObject = await this.ls.getGeoJsonByLayer(l.ds, l.title);

        const layerGeoJson = geoJSON(
          responseGeoJson,
          {
            style: (feat) => {
              if ([].indexOf(feat.properties.tileid) >= 0) {
                return ({ color: '#000000' });
              } else {
                return ({ color: '#ff7800' });
              }
            }
          });
        vm.overlays[l.name] = layerGeoJson;

        const layer: BdcLayer = {
          id: l.title,
          name: l.name,
          enabled: l.enabled,
          layer: layerGeoJson
        };
        vm.overlayers.push(layer);
      });

    } catch (err) {
      console.log('==> ERR: ' + err);

    } finally {
      this.setControlLayers();

      setTimeout(() => {
        this.applyLayersInMap();
      }, 1000);
    }
  }

  /** apply the layers that are visible on the map */
  applyLayersInMap(): void {
    const baseLayer = this.ls.getBaseLayers().filter((l: BdcLayer) => l.id === 'osm');

    if (this.overlayers[0] && this.overlayers[0].layer) {
      const newLayers: Layer[] = this.overlayers
            .filter((l: BdcLayer) => l.enabled)
            .map((l: BdcLayer) => l && l.layer);

      newLayers.unshift(baseLayer[0].layer);
      this.layers = newLayers;

    } else {
      this.layers = [baseLayer[0].layer];
    }
  }

}
