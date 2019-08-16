import { Component, OnInit, Input } from '@angular/core';
import { latLng, MapOptions, Layer, geoJSON, Map as MapLeaflet,
  LatLngBoundsExpression, Control, Draw, rectangle } from 'leaflet';
import { GeoJsonObject } from 'geojson';

import * as L from 'leaflet';
import 'leaflet.fullscreen/Control.FullScreen.js';
import 'src/assets/plugins/Leaflet.Coordinates/Leaflet.Coordinates-0.1.5.min.js';

import { BdcLayer, BdcLayerWFS } from './layers/layer.interface';
import { LayerService } from './layers/layer.service';
import { Store, select } from '@ngrx/store';
import { ExploreState } from '../explore.state';
import { setLayers, setPositionMap, setBbox } from '../explore.action';
import { SearchService } from '../sidenav/search/search.service';

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

  /** pointer to reference map */
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
  /** bounding box of Map */
  private bbox = null;

  /** start Layer and Seatch Services */
  constructor(
    private ls: LayerService,
    private ss: SearchService,
    private store: Store<ExploreState>) {
      this.store.pipe(select('explore')).subscribe(res => {
        if (res.layers) {
          this.layers$ = Object.values(res.layers).slice(0, (Object.values(res.layers).length - 1)) as Layer[];
        }
        if (res.positionMap && res.positionMap !== this.bbox) {
          this.bbox = res.positionMap;
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

    this.getTilesUsed();
    this.getBaseLayers(this.ls.getBaseLayers());
    setTimeout(() => {
      this.mountGridsLayers(this.ls.getGridsLayers());
    }, 1000);
  }

  /** get Tiles with data in grids */
  private async getTilesUsed() {
    try {
      const collections = await this.ss.getCollections();
      this.tilesUsed = [];
      collections['links'].forEach( async (c: any) => {
        if (c.title) {
          const collection = await this.ss.getCollectionByName(c.title);
          this.tilesUsed = [...this.tilesUsed, ...collection.properties['bdc:tiles']];
        }
      });

    } catch (err) {}
  }

  /** set the visible layers in the layer component of the map */
  private setControlLayers(): void {
    this.layersControl = {
      baseLayers: this.baseLayers,
      overlays: this.overlays
    };
  }

  /**
   * get the layer objects from a list of BdcLayer
   * @params {list} list of BdcLayer with the external base Layers
   */
  private getBaseLayers(listLayers: BdcLayer[]) {
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
  private async mountGridsLayers(listLayersId: BdcLayerWFS[]) {
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
              if (feat.geometry.type === 'MultiPolygon' || feat.geometry.type === 'Polygon') {
                if (this.tilesUsed && this.tilesUsed.indexOf(feat.properties.Tile) >= 0) {
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
    } finally {
      this.setControlLayers();

      setTimeout(() => {
        this.applyLayersInMap();
      }, 100);
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

  /** set position of the Map */
  private setPosition(bounds: LatLngBoundsExpression) {
    this.map.fitBounds(Object.values(bounds).slice(0, 2));
  }

  /** set Draw control of the map */
  private setDrawControl() {
    const drawControl = new Control.Draw({
      draw: {
        marker: false,
        circle: false,
        polyline: false,
        polygon: false,
        circlemarker: false,
        rectangle: {
          shapeOptions: {
            color: '#AAA'
          }
        }
      }
    });
    this.map.addControl(drawControl);

    this.map.on(Draw.Event.DRAWSTART, _ => {
      this.layers$ = this.layers$.filter( lyr => lyr['options'].className !== 'previewBbox');
      this.store.dispatch(setLayers(this.layers$));
    });

    this.map.on(Draw.Event.CREATED, e => {
      const layer: any = e['layer'];
      const newLayers = rectangle(layer.getBounds(), {
        color: '#666',
        weight: 1,
        className: 'previewBbox',
      });

      this.layers$.push(newLayers);
      this.store.dispatch(setLayers(this.layers$));
      this.store.dispatch(setBbox(newLayers.getBounds()));
      this.store.dispatch(setPositionMap(newLayers.getBounds()));
    });
  }

  /** set FullScreen option in the map */
  setFullscreenControl() {
    (L.control as any).fullscreen({
      position: 'topleft',
      title: 'Show Map Fullscreen',
      titleCancel: 'Exit Fullscreen',
      content: null,
      forceSeparateButton: true
    }).addTo(this.map);
  }

  /** set Coordinates options in the map */
  setCoordinatesControl() {
    (L.control as any).coordinates({
      position: "bottomleft",
      decimals: 5,
      decimalSeperator: ".",
      labelTemplateLat:"Lat: {y}",
      labelTemplateLng:"| Lng: {x}",
      enableUserInput: false,
      useDMS: false,
      useLatLngOrder: true,
    }).addTo(this.map);
  }

  /** event used when change Map */
  onMapReady(map: MapLeaflet) {
    this.map = map;
    this.setFullscreenControl();
    this.setDrawControl();
    this.setCoordinatesControl();
  }
}
