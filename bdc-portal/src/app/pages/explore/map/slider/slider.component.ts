import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ExploreState } from '../../explore.state';
import { Options, LabelType } from 'ng5-slider';
import { Feature } from '../../sidenav/collection/collection.interface';
import { setFeaturesPeriod, setLayers } from '../../explore.action';
import { Layer, imageOverlay, geoJSON } from 'leaflet';
import { addMonth, addDays } from 'src/app/shared/helpers/date';

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
      if (res.layers) {
        this.layers = Object.values(res.layers).slice(0, (Object.values(res.layers).length - 1)) as Layer[];
      }
      if (Object.values(res.rangeTemporal).length) {
        this.tschema = res.tschema
        this.tstep = res.tstep

        // mount list with dates
        let startDate = this.tschema.toLocaleLowerCase() === 'm' ?
          new Date(res.rangeTemporal['0']) :
          new Date(this.features[0]['properties']['datetime']);
        const lastDate = new Date(res.rangeTemporal['1']);
        while (startDate <= lastDate) {
          this.steps.push(startDate);
          startDate = this.tschema.toLocaleLowerCase() === 'm' ? addMonth(startDate) : addDays(startDate, parseInt(this.tstep));
        }
        this.steps.unshift(this.tschema.toLocaleLowerCase() === 'm' ?
          new Date(res.rangeTemporal['0']) :
          new Date(this.features[0]['properties']['datetime']));
        this.steps.pop();

        // update infos to display
        this.options = {
          showTicks: true,
          showSelectionBar: true,
          stepsArray: this.steps.map((date: Date) => {
            return { value: date.getTime() };
          }),
          translate: (value: number, _: LabelType): string => {
            if (this.tschema.toLocaleLowerCase() !== 'm') {
              return `${new Date(value).getFullYear()}-${new Date(value).getMonth() + 1}-${new Date(value).getDate()}`;
            } else {
              return `${new Date(value).getFullYear()}-${new Date(value).getMonth() + 1}`;
            }
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
    // remove features ploted in map
    const newLayers = this.layers.filter( lyr => !lyr['options'].alt || (lyr['options'].alt && lyr['options'].alt.indexOf('qls_') < 0));
    this.store.dispatch(setLayers(newLayers));

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
        const featureGeoJson = geoJSON(f);
        const bounds = featureGeoJson.getBounds();
        const newlayer = imageOverlay(f.assets.thumbnail.href, bounds, {
          alt: `qls_${f.id}`
        }).setZIndex(999);

        if (this.actived) {
          this.layers.push(newlayer);
          this.store.dispatch(setLayers(this.layers));
        }
        return {...f, enabled: this.actived};
      });
      this.store.dispatch(setFeaturesPeriod(featSelectedEdited));
    }
  }

}
