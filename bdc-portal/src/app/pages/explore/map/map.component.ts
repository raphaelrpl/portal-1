import { Component, OnInit, Input } from '@angular/core';

import * as L from 'leaflet';
import 'leaflet.fullscreen/Control.FullScreen.js';
import 'src/assets/plugins/Leaflet.Coordinates/Leaflet.Coordinates-0.1.5.min.js';
import 'esri-leaflet/dist/esri-leaflet.js';
import * as LE from 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder.js';

import { latLng, MapOptions, Layer, Map as MapLeaflet,
  LatLngBoundsExpression, Control, Draw, rectangle, layerGroup } from 'leaflet';
import { BdcLayer, BdcGrid } from './layers/layer.interface';
import { LayerService } from './layers/layer.service';
import { Store, select } from '@ngrx/store';
import { ExploreState } from '../explore.state';
import { setPositionMap, setBbox, removeLayers, setLayers, removeGroupLayer } from '../explore.action';
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

  /** base url of geoserver */
  private urlGeoserver = window['__env'].urlGeoserver;

  /** pointer to reference map */
  public map: MapLeaflet;
  /** object with map settings */
  public options: MapOptions;
  /** layers displayed on the Leaflet control component */
  public layersControl: any;

  /** tiles used with data in the BDC project */
  private tilesUsed: number[];
  /** bounding box of Map */
  private bbox = null;
  /** grid selected and visible in the map */
  private actualGrid: string;
  /** opacity of images disaplyed in the map */
  private actualOpacity = 1;

  /** start Layer and Seatch Services */
  constructor(
    private ls: LayerService,
    private ss: SearchService,
    private store: Store<ExploreState>) {
      this.store.pipe(select('explore')).subscribe(res => {
        // add layers
        if (Object.values(res.layers).length > 1) {
          const lyrs = Object.values(res.layers).slice(0, (Object.values(res.layers).length - 1)) as Layer[];
          lyrs.forEach( l => {
            if (l['options'].alt) {
              if (res.opacity && l['options'].alt.indexOf(`qls_`) >= 0) {
                (l as L.ImageOverlay).setOpacity(parseFloat(res.opacity)).setZIndex(9999);
              }
              if (l['options'].alt.indexOf(`samples_`) >= 0) {
                (l as L.TileLayer).setZIndex(999);
              }
            }
            this.map.addLayer(l);
          });
          this.store.dispatch(setLayers([]));
        }
        // remove layers by title
        if (Object.values(res.layersToDisabled).length > 1) {
          const lyrs = Object.values(res.layersToDisabled).slice(0, (Object.values(res.layersToDisabled).length - 1)) as Layer[];
          this.map.eachLayer( l => {
            if (l['options'].alt && lyrs.indexOf(l['options'].alt) >= 0) {
              this.map.removeLayer(l);
            }
          });
          this.store.dispatch(removeLayers([]));
        }
        // remove layers by prefix
        if (res.layerGroupToDisabled['key'] && res.layerGroupToDisabled['prefix']) {
          const key = res.layerGroupToDisabled['key'];
          const prefix = res.layerGroupToDisabled['prefix'];
          this.map.eachLayer( l => {
            if (l['options'][key] && l['options'][key].indexOf(prefix) >= 0) {
              this.map.removeLayer(l);
            }
          });
          this.store.dispatch(removeGroupLayer({}));
        }
        // set position map
        if (res.positionMap && res.positionMap !== this.bbox) {
          this.bbox = res.positionMap;
          this.setPosition(res.positionMap);
        }
        // display other grid
        if (res.grid !== '' && res.grid !== this.actualGrid) {
          this.setGrid(res.grid);
        }
        // display other grid
        // tslint:disable-next-line
        if (res.opacity >= 0 && res.opacity != this.actualOpacity) {
          this.map.eachLayer( l => {
            if (l['options'].alt && l['options'].alt.indexOf(`qls_`) >= 0) {
              (l as L.ImageOverlay).setOpacity(parseFloat(res.opacity));
            }
          });
          this.actualOpacity = res.opacity;
        }
      });
  }

  /**
   * set layers and initial configuration of the map
   */
  ngOnInit() {
    this.options = {
      zoom: 5,
      center: latLng(-16, -52)
    };

    this.getTilesUsed();
    setTimeout(() => {
      this.setControlLayers();
    }, 2000);
  }

  /**
   * get Tiles with data in grids
   */
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

  /**
   * set position of the Map
   */
  private setPosition(bounds: LatLngBoundsExpression) {
    this.map.fitBounds(Object.values(bounds).slice(0, 2));
  }

  /**
   * set grid of the Map and remove others with different name
   */
  private setGrid(grid: string) {
    Object.keys(this.layersControl.overlays).forEach( (key: string) => {
      const layer = this.layersControl.overlays[key];
      if (key === grid) {
        this.map.addLayer(layer);
      } else {
        this.actualGrid = grid;
        this.map.removeLayer(layer);
      }
    });
  }

  /**
   * set FullScreen option in the map
   */
  private setFullscreenControl() {
    (L.control as any).fullscreen({
      position: 'topleft',
      title: 'Show Map Fullscreen',
      titleCancel: 'Exit Fullscreen',
      content: null,
      forceSeparateButton: true
    }).addTo(this.map);
  }

  /**
   * set Draw control of the map
   */
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
            color: '#CCC'
          }
        }
      }
    });
    this.map.addControl(drawControl);

    // remove last bbox
    this.map.on(Draw.Event.DRAWSTART, _ => {
      this.map.eachLayer( l => {
        if (l['options'].className === 'previewBbox') {
          this.map.removeLayer(l);
        }
      });
    });

    // add bbox in the map
    this.map.on(Draw.Event.CREATED, e => {
      const layer: any = e['layer'];
      const newLayer = rectangle(layer.getBounds(), {
        color: '#CCC',
        weight: 1,
        interactive: false,
        className: 'previewBbox'
      });

      this.map.addLayer(newLayer);
      this.store.dispatch(setBbox(newLayer.getBounds()));
      this.store.dispatch(setPositionMap(newLayer.getBounds()));
    });
  }

  /**
   * set the visible layers in the layer component of the map
   */
  private setControlLayers() {
    this.layersControl = {
      baseLayers: {},
      overlays: {}
    };
    // mount base layers
    this.ls.getBaseLayers().forEach( (l: BdcLayer) => {
      if (l.id === 'google_hybrid') {
        l.layer.addTo(this.map);
      }
      this.layersControl.baseLayers[l.name] = l.layer;
    });
    // mount overlays
    this.ls.getGridsLayers().forEach( (l: BdcGrid) => {
      if (l.filter) {
        const layerGrid = L.tileLayer.wms(`${this.urlGeoserver}/grids/wms`, {
          layers: `grids:${l.id}`,
          format: 'image/png',
          styles: 'grids:tiles_used',
          transparent: true,
          cql_filter: `Tile IN ('${this.tilesUsed.join("','")}')`,
          alt: `grid_${l.id}`
        } as any);
        const layerGridUsed = L.tileLayer.wms(`${this.urlGeoserver}/grids/wms`, {
          layers: `grids:${l.id}`,
          format: 'image/png',
          styles: 'grids:tiles',
          transparent: true,
          cql_filter: `Tile NOT IN ('${this.tilesUsed.join("','")}')`,
          alt: `grid_${l.id}`
        } as any);
        this.layersControl.overlays[l.id] = layerGroup([layerGrid, layerGridUsed]);

      } else {
        const layerGrid = L.tileLayer.wms(`${this.urlGeoserver}/grids/wms`, {
          layers: `grids:${l.id}`,
          format: 'image/png',
          styles: 'grids:tiles',
          transparent: true,
          alt: `grid_${l.id}`
        } as any);
        this.layersControl.overlays[l.id] = layerGroup([layerGrid]);
      }

      if (l.enabled) {
        this.actualGrid = l.id;
        this.map.addLayer(this.layersControl.overlays[l.id]);
      }
    });
  }

  /**
   * set Coordinates options in the map
   */
  private setCoordinatesControl() {
    (L.control as any).coordinates({
      position: 'bottomleft',
      decimals: 5,
      decimalSeperator: '.',
      labelTemplateLat: 'Lat: {y}',
      labelTemplateLng: '| Lng: {x}',
      enableUserInput: false,
      useDMS: false,
      useLatLngOrder: true,
    }).addTo(this.map);
  }

  /**
   * set Geocoder options in the map
   */
  private setGeocoderControl() {
    const searchControl = LE.geosearch().addTo(this.map);
    const vm = this;

    searchControl.on('results', data => {
      vm.map.eachLayer( l => {
        if (l['options'].className === 'previewBbox') {
          vm.map.removeLayer(l);
        }
      });

      for (let i = data.results.length - 1; i >= 0; i--) {
        const newLayer = rectangle(data.results[i].bounds, {
          color: '#CCC',
          weight: 1,
          interactive: false,
          className: 'previewBbox'
        });

        vm.map.addLayer(newLayer);
        vm.store.dispatch(setBbox(newLayer.getBounds()));
        vm.store.dispatch(setPositionMap(newLayer.getBounds()));
      }
    });
  }

  /**
   * event used when change Map
   */
  onMapReady(map: MapLeaflet) {
    this.map = map;
    this.setFullscreenControl();
    this.setDrawControl();
    this.setCoordinatesControl();
    this.setGeocoderControl();
  }
}
