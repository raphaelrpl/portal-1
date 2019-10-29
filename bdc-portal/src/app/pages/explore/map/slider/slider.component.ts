import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ExploreState } from '../../explore.state';
import { Options, LabelType } from 'ng5-slider';
import { Feature } from '../../sidenav/collection/collection.interface';
import { setFeaturesPeriod, setLayers, removeGroupLayer, setActualRangeTemporal, setEditFeature } from '../../explore.action';
import { Layer } from 'leaflet';
import { addMonth, addDays, subMonth, subDays } from 'src/app/shared/helpers/date';

import * as L from 'leaflet';
import 'src/assets/plugins/Leaflet.ImageTransform/leafletImageTransform.js';

/**
 * Map Slider component
 * component to manage slider of the map
 */
@Component({
  selector: 'app-map-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent {

  /** all features */
  private features: Feature[] = [];
  /** status cube - actived ou disactived */
  private actived: boolean;
  /** steps - list dates to mount slider */
  public steps: Date[] = [];
  /** position selected in slider - actual date */
  public value: Date;
  /** options used to mount slider */
  public options: Options = {};
  /** layers/features visibled in the map */
  public layers: Layer[];
  /** temporal schema of the selected cube */
  private tschema: string;
  /** temporal step of the selected cube */
  private tstep: string;

  private urlBDCTiler = window['__env'].urlBDCTiler;

  constructor(private store: Store<ExploreState>) {
    this.store.pipe(select('explore')).subscribe(res => {
      const lastStep = this.steps;
      const lastFeatures = this.features;
      const lastTSchema = this.tschema;
      const lastType = lastFeatures[0] ? lastFeatures[0]['properties']['bdc:time_aggregation'] : null;

      this.steps = [];
      if (res.features) {
        this.features = Object.values(res.features).slice(0, (Object.values(res.features).length - 1)) as Feature[];
      }
      if (res.featuresPeriod) {
        const features = Object.values(res.featuresPeriod).slice(0, 1) as Feature[];
        this.actived = !features.length || (features[0] && features[0]['enabled'] !== false);
      }
      if (Object.values(res.rangeTemporal).length && this.features.length) {
        this.tschema = res.tschema;
        this.tstep = res.tstep;

        // mount list with dates
        let startDate = new Date(res.rangeTemporal['0']);
        const lastDate = new Date(res.rangeTemporal['1']);
        while (startDate <= lastDate) {
          this.steps.push(startDate);
          startDate = this.nextPeriod(startDate);
        }

        // insert first step/period
        this.steps.unshift(new Date(res.rangeTemporal['0']));
        // remove last period
        this.steps.pop();
        if (this.tschema.toLocaleLowerCase() !== 'm') {
          this.steps.pop();
        }

        // update infos to display
        this.options = {
          showTicks: true,
          stepsArray: this.steps.map((date: Date) => {
            return { value: date.getTime() };
          }),
          translate: (value: number, _: LabelType): string => {
            return `${this.formatDate(value)} / ${this.formatDate(this.nextPeriod(new Date(value)).getTime())}`
          }
        };

        setTimeout( _ => {
          if ((this.steps.length !== lastStep.length) ||
              (lastFeatures.length !== this.features.length) ||
              (lastType !== null && this.features[0] && (lastType !== this.features[0]['properties']['bdc:time_aggregation'])) ||
              (lastTSchema !== this.tschema)
            ) {
            this.changeValue(new Date(res.rangeTemporal['0']));
          }
        });
      }
    });
  }

  /** select the features by value selected in slider */
  public changeValue(startDate: Date) {
    // remove images displayed
    this.store.dispatch(removeGroupLayer({
      key: 'className',
      prefix: 'cube_'
    }));

    // filter new features
    const actualDate = this.value ? new Date(this.value) : startDate;
    if (actualDate) {
      // get start / date by period
      const startPeriod = new Date(actualDate.setMonth(actualDate.getMonth()));
      const endPeriod = this.tschema.toLocaleLowerCase() === 'm' ? addMonth(actualDate) : addDays(actualDate, parseInt(this.tstep));

      // apply filter
      const featSelected = this.features.filter(feat => {
        return new Date(feat.properties['datetime']) >= startPeriod && new Date(feat.properties['datetime']) < endPeriod;
      });

      // plot new features
      const featSelectedEdited = featSelected.map( (f: any) => {
        const composite = f['composite']
        const bands = composite ? Object.values(composite['bands']).join(',') : 'red,green,blue';
        const color_formula = composite ? 
          `Gamma RGB ${composite.gamma} Saturation ${composite.saturation} Sigmoidal RGB ${composite.sigmoidal} 0.35` : 
          "Gamma RGB 4.5 Saturation 2 Sigmoidal RGB 10 0.35";

        let url = `${this.urlBDCTiler}/${f.id}/{z}/{x}/{y}.png`;
        url += `?bands=${bands}&color_formula=${color_formula}`;
        const layerTile = new L.TileLayer(url, {
          className: `cube_${f.id}`,
          attribution: `Brazil Data Cube`
        });

        if (this.actived) {
          this.store.dispatch(setLayers([layerTile]));
        }
        return {...f, enabled: this.actived};
      });

      setTimeout( _ => {
        this.store.dispatch(setFeaturesPeriod(featSelectedEdited));
        const startDatePeriod = this.tschema.toLocaleLowerCase() === 'm' ?
          subMonth(actualDate) : subDays(actualDate, parseInt(this.tstep));
        this.store.dispatch(setActualRangeTemporal([startDatePeriod, endPeriod]));
      });
    }
  }

  /** 
   * sum with one period
   */
  public nextPeriod(date: Date): Date {
    return this.tschema.toLocaleLowerCase() === 'm' ? addMonth(date) : addDays(date, parseInt(this.tstep));
  }

  /** 
   * format datetime to string by temporal schema
   */
  public formatDate(value: number): string {
    if (this.tschema.toLocaleLowerCase() !== 'm') {
      return `${new Date(value).getFullYear()}-${new Date(value).getMonth() + 1}-${new Date(value).getDate()}`;
    } else {
      return `${new Date(value).getFullYear()}-${new Date(value).getMonth() + 1}`;
    }
  }

}
