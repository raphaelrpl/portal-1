import { Component } from '@angular/core';
// import { MatBottomSheetRef } from '@angular/material';
import { ExploreState } from '../../../explore.state';
import { Store, select } from '@ngrx/store';

/**
 * Map TimeSeries component
 * component to view time series
 */
@Component({
  selector: 'app-map-box-timeseries',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxTimeSeriesComponent {

  /** bands of the cube */
  public bands: object = {};

  constructor(
    // private bottomSheetRef: MatBottomSheetRef<BoxTimeSeriesComponent>,
    private store: Store<ExploreState>) {
    this.store.pipe(select('explore')).subscribe(res => {
      if (res.bands) {
        let bands = Object.values(res.bands).slice(0, (Object.values(res.bands).length - 1)) as string[];
        bands.forEach( (band: string) => {
          this.bands[band] = true;
        });
      }
    });
  }

  openLink(event: MouseEvent) {
    // this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  viewGraphic() {
    console.log('plot map');
  }
}
