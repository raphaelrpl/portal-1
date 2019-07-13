import { Component, OnInit, Input } from '@angular/core';
import { latLng, MapOptions, Layer, geoJSON } from 'leaflet';
import { GeoJsonObject } from 'geojson';

import { BdcLayersWMS, BdcLayersWFS } from './layers/layer.interface';
import { LayerService } from './layers/layer.service';

@Component({
  selector: 'app-base-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() width: number;
  @Input() height: number;

  public options: MapOptions;
  public layersControl: any;
  public layers: Layer[];
  public overlayers: BdcLayersWMS[];

  public baseLayers = {};
  public overlays = {};

  constructor(private ls: LayerService) {}

  ngOnInit() {
    this.options = {
      zoom: 5,
      center: latLng(-16, -52)
    };

    this.setBaseLayers(this.ls.getBaseLayers());
    this.setGridsLayers(this.ls.getGridsLayers());
  }

  setControlLayers(): void {
    this.layersControl = {
      baseLayers: this.baseLayers,
      overlays: this.overlays
    };
  }

  setBaseLayers(listLayers: BdcLayersWMS[]) {
    const vm = this;
    listLayers.forEach( (l: BdcLayersWMS) => {
      vm.baseLayers[l.name] = l.layer;
    });
  }

  async setGridsLayers(listLayersId: BdcLayersWFS[]) {
    try {
      const vm = this;
      this.overlayers = [];

      await listLayersId.forEach( async (l: BdcLayersWFS) => {
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

        const layer: BdcLayersWMS = {
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

  applyLayersInMap(): void {
    const baseLayer = this.ls.getBaseLayers().filter((l: BdcLayersWMS) => l.id === 'osm');

    if (this.overlayers[0] && this.overlayers[0].layer) {
      const newLayers: Layer[] = this.overlayers
            .filter((l: BdcLayersWMS) => l.enabled)
            .map((l: BdcLayersWMS) => l && l.layer);

      newLayers.unshift(baseLayer[0].layer);
      this.layers = newLayers;

    } else {
      this.layers = [baseLayer[0].layer];
    }
  }

}
