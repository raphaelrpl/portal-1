import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ExploreState } from '../../explore.state';
import { Options, LabelType } from 'ng5-slider';
import { Feature } from '../../sidenav/collection/collection.interface';
import { setFeaturesPeriod, setLayers } from '../../explore.action';
import { Layer, imageOverlay, geoJSON } from 'leaflet';
import { addMonth } from 'src/app/shared/helpers/date';

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
  private actived: Boolean;
  /** steps - list dates to mount slider */
  public steps: Date[] = [];
  /** position selected in slider - actual date */
  public value: Date;
  /** options used to mount slider */
  public options: Options = {};
  /** layers/features visibled in the map */
  public layers: Layer[];

  constructor(private store: Store<ExploreState>) {
    this.store.pipe(select('explore')).subscribe(res => {
      this.steps = [];
      if (res.features) {
        this.features = Object.values(res.features).slice(0, (Object.values(res.features).length - 1)) as Feature[];
      }
      if (res.featuresPeriod) {
        const features = Object.values(res.featuresPeriod).slice(0, 1) as Feature[];
        this.actived = features[0] && features[0]['enabled'] !== false;
      }
      if (res.layers) {
        this.layers = Object.values(res.layers).slice(0, (Object.values(res.layers).length - 1)) as Layer[];
      }
      if (Object.values(res.rangeTemporal).length) {
        // mount list with dates
        let startDate = new Date(res.rangeTemporal['0']);
        const lastDate = new Date(res.rangeTemporal['1']);
        while (startDate <= lastDate) {
          this.steps.push(startDate);
          startDate = addMonth(startDate);
        }
        this.steps.unshift(new Date(res.rangeTemporal['0']));
        this.steps.pop();

        // update infos to display
        this.options = {
          showTicks: true,
          showSelectionBar: true,
          stepsArray: this.steps.map((date: Date) => {
            return { value: date.getTime() };
          }),
          translate: (value: number, _: LabelType): string => {
            return `${new Date(value).getFullYear()}-${new Date(value).getMonth() + 1}`;
          }
        }
      }
    });
  }

  /** select the features by value selected in slider */
  public changeValue() {
    // remove features ploted in map
    const newLayers = this.layers.filter( lyr => !lyr['options'].alt || (lyr['options'].alt && lyr['options'].alt.indexOf('qls_') < 0));
    this.store.dispatch(setLayers(newLayers));

    // filter new features
    // TODO:
    const thisDate = new Date(this.value);
    let startPeriod = new Date(thisDate.setMonth(thisDate.getMonth()));
    const endPeriod = addMonth(thisDate);

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
      return {...f, enabled: this.actived}
    });
    this.store.dispatch(setFeaturesPeriod(featSelectedEdited));
  }

}