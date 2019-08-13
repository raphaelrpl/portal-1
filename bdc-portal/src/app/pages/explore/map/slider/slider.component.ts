import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ExploreState } from '../../explore.state';
import { formatDateUSA } from 'src/app/shared/helpers/date';
import { Options, LabelType } from 'ng5-slider';
import { Feature } from '../../sidenav/collection/collection.interface';

@Component({
  selector: 'app-map-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  public steps: Date[] = [];
  public value = 0;
  public features: Feature[] = [];
  public options: Options = {};

  constructor(private store: Store<ExploreState>) {
    this.store.pipe(select('explore')).subscribe(res => {
      this.steps = [];
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
        this.changeValue();
      }

      if (res.features) {
        this.features = Object.values(res.features).slice(0, (Object.values(res.features).length - 1)) as Feature[];
      }
    });
  }

  ngOnInit(): void {
    this.options = {
      showTicks: true,
      translate: (value: number, _: LabelType): string => {
        return `${new Date(value).getFullYear()}-${new Date(value).getMonth() + 1}`;
      }
    };
  }

  public formatDateToString(date: Date): string {
    return date ? formatDateUSA(date) : '';
  }

  public changeValue() {
    const startPeriod = new Date(this.value);
    const endPeriod = new Date(startPeriod.setMonth(startPeriod.getMonth() + 1));
    const featSelected = this.features.filter(feat => {
      return new Date(feat.properties['datetime']) >= new Date(this.value) && new Date(feat.properties['datetime']) < endPeriod;
    });
  }

}
