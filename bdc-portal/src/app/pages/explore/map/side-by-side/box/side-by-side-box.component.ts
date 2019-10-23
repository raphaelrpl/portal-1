import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Feature } from '../../../sidenav/collection/collection.interface';
import { addMonth, addDays, subDays } from 'src/app/shared/helpers/date';
import { Map as MapLeaflet, MapOptions, latLng } from 'leaflet';
import * as L from 'leaflet';
import 'src/assets/plugins/Leaflet.SideBySide/index.js';

@Component({
  selector: 'app-side-by-side-box',
  templateUrl: './side-by-side-box.component.html',
  styleUrls: ['./side-by-side-box.component.scss']
})
export class SideBySideBoxComponent {
    
  /** pointer to reference map */
  public map: MapLeaflet;
  public options: MapOptions;
  private sideControl: any;
  private urlBDCTiler = window['__env'].urlBDCTiler;

  public disabled = false;
  public periods: string[];
  private features: Feature[];
  private tstep: string;
  private tschema: string;

  public first: Feature;
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

  ngOnInit(): void {
    this.options = {
      zoom: 5,
      center: latLng(-16, -52)
    };
  }

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
   * event used when change Map
   */
  onMapReady(map: MapLeaflet) {
    this.map = map;
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

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
