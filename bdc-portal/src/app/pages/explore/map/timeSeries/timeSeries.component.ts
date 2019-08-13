import { Component } from '@angular/core';
import { Feature } from '../../sidenav/collection/collection.interface';
import { Store, select } from '@ngrx/store';
import { ExploreState } from '../../explore.state';

/**
 * Map TimeSeries component
 * component to view time series of the cube
 */
@Component({
  selector: 'app-map-timeseries',
  templateUrl: './timeSeries.component.html',
  styleUrls: ['./timeSeries.component.scss']
})
export class TimeSeriesComponent {

  public actived = false;
  public features$: Feature[] = [];

  constructor(private store: Store<ExploreState>) {
    this.store.pipe(select('explore')).subscribe(res => {
      if (res.features) {
        this.features$ = Object.values(res.features).slice(0, (Object.values(res.features).length - 1)) as Feature[];
      }
    });
  }

  public active() {
    this.actived = true;
  }

  public desactive() {
    this.actived = false;
  }

}
