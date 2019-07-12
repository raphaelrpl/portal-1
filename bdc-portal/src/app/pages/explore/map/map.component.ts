import { Component, OnInit, Input } from '@angular/core';
import { latLng, MapOptions, Layer as LayerLeaflet, Control, geoJSON } from 'leaflet';

import { Layer, LayerId } from './layers/layer.interface';
import { BaseLayers, OverlayersId } from './layers/baseLayers.in-memory';
import { LayerService } from './layers/layer.service';
import { GeoJsonObject } from 'geojson';

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
  public layers: LayerLeaflet[];
  public overlayers: Layer[];

  public baseLayers = {}
  public overlays = {}

  constructor(private ls: LayerService) {}

  ngOnInit() {
    this.options = {
      zoom: 5,
      center: latLng(-16, -52)
    };

    this.getLayerObject(BaseLayers)
    this.getLayerObjectByService(OverlayersId)
  }

  getLayerObject(listLayers: Layer[]): any {
    const vm = this;
    listLayers.forEach( (l: Layer) => {
      vm.baseLayers[l.name] = l.layer;
    });
  }

  async getLayerObjectByService(listLayersId: LayerId[]) {
    try {
      const vm = this;
      this.overlayers = [];

      await listLayersId.forEach( async (l: LayerId) => {
        let responseGeoJson: GeoJsonObject = await this.ls.getLayerGeoJson(l.ds, l.title)

        const layerGeoJson = geoJSON(
          responseGeoJson,
          { style: () => ({ color: '#ff7800' })}
        )
        vm.overlays[l.name] = layerGeoJson

        let layer: Layer = {
          id: l.title,
          name: l.name,
          enabled: l.enabled,
          layer: layerGeoJson
        }
        vm.overlayers.push(layer)
      });

    } catch(err) {
      console.log('ERR ====> !')

    } finally {
      this.setControlLayers()
      setTimeout(() => {
        this.applyLayersEnabled()
      }, 1000);
    }      
  }

  setControlLayers(): void {
    this.layersControl = {
      baseLayers: this.baseLayers,
      overlays: this.overlays
    };
  }

  applyLayersEnabled(): void {
    const baseLayer = BaseLayers.filter((l: Layer) => l.id === 'osm');

    if (this.overlayers[0] && this.overlayers[0].layer) {
      const newLayers: LayerLeaflet[] = this.overlayers
            .filter((l: Layer) => l.enabled)
            .map((l: Layer) => l && l.layer);

      newLayers.unshift(baseLayer[0].layer);
      this.layers = newLayers;

    } else {
      this.layers = [baseLayer[0].layer];
    }
  }

}
