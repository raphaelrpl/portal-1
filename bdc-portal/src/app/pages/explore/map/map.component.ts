import { Component, OnInit, Input } from '@angular/core';
import { latLng, MapOptions, Layer, geoJSON, Map as MapLeaflet, LatLngBounds, LatLngBoundsExpression } from 'leaflet';
import { GeoJsonObject } from 'geojson';

import { BdcLayer, BdcLayerWFS } from './layers/layer.interface';
import { LayerService } from './layers/layer.service';
import { Store, select } from '@ngrx/store';
import { ExploreState } from '../explore.state';
import { setLayers, addLayer } from '../explore.action';

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

  public map: MapLeaflet;

  /** object with map settings */
  public options: MapOptions;
  /** layers displayed on the Leaflet control component */
  public layersControl: any;
  /** visible layers in the map */
  public layers$: Layer[];
  /** all overlay layers read and mounted */
  private overlayers: BdcLayer[];
  /** tiles used with data in the BDC project */
  private tilesUsed: number[];

  /** all available base layers for viewing (layer object only) */
  private baseLayers = {};
  /** all overlay layers available for viewing (layer object only) */
  private overlays = {};

  /** start Layer Service */
  constructor(
    private ls: LayerService,
    private store: Store<ExploreState>) {
      this.store.pipe(select('explore')).subscribe(res => {
        if (res.layers) {
          this.layers$ = <Layer[]>Object.values(res.layers).slice(0, (Object.values(res.layers).length-1));
        }
      });

      this.store.pipe(select('explore')).subscribe(res => {
        if (res.positionMap) {
          this.setPosition(res.positionMap);
        }
      });
  }

  /** set layers and initial configuration of the map */
  ngOnInit() {
    this.options = {
      zoom: 5,
      center: latLng(-16, -52)
    };

    this.setTilesUsed();
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

  async setTilesUsed() {
    try {
      const tiles = await this.ls.getTilesUsed();
      this.tilesUsed = tiles.map( t => t.tileid );

    } catch (err) {
      console.log('==> ERR: ' + err);
      this.tilesUsed = [];
    }
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
            onEachFeature: (feat, layer) => {
              const lyr = (layer) as any;
              if (feat.geometry.type === 'MultiPolygon') {
                if (this.tilesUsed && this.tilesUsed.indexOf(feat.properties.Tile) >= 0) {

                  // TODO: create markers

                  // apply style
                  lyr.setStyle({
                    color: '#0033cc',
                    weight: 2,
                    fillColor: '#009999',
                    fillOpacity: 0.4
                  });

                } else {
                  lyr.setStyle({
                    color: '#0033CC',
                    weight: 1,
                    fillOpacity: 0.2
                  });
                }
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

      // set base layer with firsty   
      newLayers.unshift(baseLayer[0].layer);
      this.store.dispatch(setLayers(newLayers));
      
    } else {
      const newLayers = [baseLayer[0].layer];
      this.store.dispatch(setLayers(newLayers));
    }
  }

  setPosition(bounds: LatLngBoundsExpression) {
    this.map.fitBounds(Object.values(bounds).slice(0,2));
  }

  onMapReady(map: MapLeaflet) {
    this.map = map;
  }
}
