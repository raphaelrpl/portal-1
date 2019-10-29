import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Feature } from '../../../sidenav/collection/collection.interface';
import { addMonth, addDays, subDays } from 'src/app/shared/helpers/date';
import { Map as MapLeaflet, MapOptions, latLng } from 'leaflet';
import * as L from 'leaflet';
import 'src/assets/plugins/Leaflet.SideBySide/index.js';

/**
 * Box to view/manage map with side_by_side effects
 */
@Component({
  selector: 'app-side-by-side-box',
  templateUrl: './side-by-side-box.component.html',
  styleUrls: ['./side-by-side-box.component.scss']
})
export class SideBySideBoxComponent {
  
  /** url to BDC Tiler - used to view tiles by TMS */
  private urlBDCTiler = window['__env'].urlBDCTiler;
  /** pointer to reference map */
  public map: MapLeaflet;
  /** options to compose map */
  public options: MapOptions;
  /** reference to side_by_side control */
  private sideControl: any;
  /** periods by feature availables to select and compare */
  public periods: string[];
  /** features availables to select and compare */
  private features: Feature[];
  /** temporal step of the cube selected */
  private tstep: string;
  /** temporal schema of the cube selected */
  private tschema: string;
  /** btn status - true if two layers selected */
  public disabled = false;
  
  /** first layer selected to compare */
  public first: Feature;
  /** second layer selected to compare */
  public second: Feature;

  /** receive infos to display in this component */
  constructor(
    public dialogRef: MatDialogRef<SideBySideBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.features = data.features;
      this.tstep = data.tstep;
      this.tschema = data.tschema;
      this.periods = [];
      this.features.forEach( f => {
        if (this.periods.indexOf(f.properties['datetime']) < 0) {
          this.periods.push(f.properties['datetime']);
          this.periods.sort();
        }
      });
  }

  /**
   * set start options of the map
   */
  ngOnInit(): void {
    this.options = {
      zoom: 5,
      center: latLng(-16, -52)
    };
  }

  /**
   * set layers by period selected
   */
  public applyOverlayers() {
    this.disabled = true;
    if (this.sideControl) {
      this.clearMap();
    }

    let firstLayers = [];
    let secondLayers = [];
    let featGroup = new L.FeatureGroup();
    this.features.forEach( f => {
      if (f.properties['datetime'] === this.first) {
        firstLayers.push(this.setLayer(f));
        featGroup.addLayer(L.geoJSON(f.geometry as any))
      } else if (f.properties['datetime'] === this.second) {
        secondLayers.push(this.setLayer(f));
      }
    });

    setTimeout( _ => {
      this.sideControl = (L.control as any).sideBySide(firstLayers, secondLayers);
      this.sideControl.addTo(this.map);
      this.map.fitBounds(featGroup.getBounds());
      this.disabled = false;
    });
  }

  /**
   * display layer in map
   */
  private setLayer(feature: Feature) {
    const composite = feature['composite'];
    const bands = composite ? Object.values(composite['bands']).join(',') : 'red,green,blue';
    const colorFormulaSecond = composite ? 
      `Gamma RGB ${composite.gamma} Saturation ${composite.saturation} Sigmoidal RGB ${composite.sigmoidal} 0.35` : 
      "Gamma RGB 4.5 Saturation 2 Sigmoidal RGB 10 0.35";

    let urlSecond = `${this.urlBDCTiler}/${feature.id}/{z}/{x}/{y}.png`;
    urlSecond += `?bands=${bands}&color_formula=${colorFormulaSecond}`;
    const LayerTile = new L.TileLayer(urlSecond, {
      className: `cube_compare_${feature.id}`
    }).addTo(this.map);

    return LayerTile;
  }

  /**
   * event used when change Map
   */
  onMapReady(map: MapLeaflet) {
    this.map = map;
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }


  /**
   * remove layers of the map
   */
  private clearMap() {
    this.map.removeControl(this.sideControl);
    this.map.eachLayer(l => {
      if (l['options'].className && l['options'].className.indexOf('cube_compare_') >= 0) {
        this.map.removeLayer(l);
      }
    });
  }

  /** 
   * convert date to default format
   */
  public getDateFormated(dateStr: string): string {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
  }

  /** 
   * sum with one period
   */
  public getNextPeriod(dateStr: string): string {
    const date = new Date(dateStr);
    const nextDate = subDays(this.tschema.toLocaleLowerCase() === 'm' ? addMonth(date) : addDays(date, (parseInt(this.tstep)-1)), 1);
    return `${nextDate.getFullYear()}-${nextDate.getMonth()+1}-${nextDate.getDate()}`;
  }
}
