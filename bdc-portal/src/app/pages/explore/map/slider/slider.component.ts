import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ExploreState } from '../../explore.state';
import { Options, LabelType } from 'ng5-slider';
import { Feature } from '../../sidenav/collection/collection.interface';
import { setFeaturesPeriod, setLayers } from '../../explore.action';
import { Layer, imageOverlay, geoJSON } from 'leaflet';

/**
 * Map Slider component
 * component to manage slider of the map
 */
@Component({
  selector: 'app-map-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  /** all features */
  private features: Feature[] = [];
  /** steps - list dates to mount slider */
  public steps: Date[] = [];
  /** position selected in slider */
  public value = 0;
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
      if (res.layers) {
        this.layers = Object.values(res.layers).slice(0, (Object.values(res.layers).length - 1)) as Layer[];
      }
      if (Object.values(res.rangeTemporal).length) {
        const lastDate = new Date(res.rangeTemporal['1']);
        let startDate = new Date(res.rangeTemporal['0']);
        while (startDate <= lastDate) {
          this.steps.push(startDate);
          startDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
        }

        this.steps.unshift(new Date(res.rangeTemporal['0']));
        this.steps.pop();
        this.options.stepsArray = this.steps.map((date: Date) => {
          return { value: date.getTime() };
        });
      }
    });
  }

  /** set basic infos to mount Slider component */
  ngOnInit(): void {
    this.options = {
      showTicks: true,
      translate: (value: number, _: LabelType): string => {
        return `${new Date(value).getFullYear()}-${new Date(value).getMonth() + 1}`;
      }
    };
  }

  /** select the features by value selected in slider */
  public changeValue() {
    // remove features ploted in map
    const newLayers = this.layers.filter( lyr => !lyr['options'].alt || (lyr['options'].alt && lyr['options'].alt.indexOf('qls_') < 0));
    this.store.dispatch(setLayers(newLayers));
    // filter new features

    // TODO:
    const schema = 'm';
    let startPeriod = new Date(this.value);
    if (schema == 'm') {
      startPeriod = new Date(startPeriod.setDate(1));
    }
    const endPeriod = new Date(startPeriod.setMonth(startPeriod.getMonth() + 1));
    const featSelected = this.features.filter(feat => {
      return new Date(feat.properties['datetime']) >= new Date(this.value) && new Date(feat.properties['datetime']) < endPeriod;
    });

    // plot new features
    const featSelectedEdited = featSelected.map( (f: any) => {
      const featureGeoJson = geoJSON(f);
      const bounds = featureGeoJson.getBounds();
      const newlayer = imageOverlay(f.assets.thumbnail.href, bounds, {
        alt: `qls_${f.id}`
      }).setZIndex(999);

      this.layers.push(newlayer);
      this.store.dispatch(setLayers(this.layers));
      return {...f, enabled: true}
    });
    this.store.dispatch(setFeaturesPeriod(featSelectedEdited));
  }

}