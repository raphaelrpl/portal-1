import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ExploreState } from '../../explore.state';
import { formatDateUSA } from 'src/app/shared/helpers/date';

@Component({
  selector: 'app-map-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  public steps: Date[] = []

  constructor(private store: Store<ExploreState>) {
    this.store.pipe(select('explore')).subscribe(res => {
      if (Object.values(res.rangeTemporal).length) {
        this.steps = [res.rangeTemporal['0'], res.rangeTemporal['0']]
      }
    });
  }

  ngOnInit() {
  }

  public formatDateToString(date: Date): string {
    return date ? formatDateUSA(date) : '';
  }

}
