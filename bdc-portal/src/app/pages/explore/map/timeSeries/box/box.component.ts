import { Component } from '@angular/core';
import { ExploreState } from '../../../explore.state';
import { Store, select } from '@ngrx/store';
import { Layer, LatLng } from 'leaflet';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';

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
  public listBands: string[];
  /** lat lng of point */
  public latLng: LatLng;
  /** visible status of the graphic */
  public graphicShow = false;

  public lineChartData: ChartDataSets[] = [
    {
      data: [65, 59, 80, 81, 56, 55, 40],
      label: 'Series A',
      lineTension: 0
    },
  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
  } as any;
  public lineChartColors: Color[] = [
    {
      borderColor: 'rgba(0,255,0,0.3)',
      backgroundColor: 'rgba(0,0,0,0)',
    },
  ];
  public lineChartLegend = true;

  constructor(
    private store: Store<ExploreState>) {
    this.store.pipe(select('explore')).subscribe(res => {
      if (res.bands) {
        this.listBands = Object.values(res.bands).slice(0, (Object.values(res.bands).length - 1)) as string[];
        this.listBands.forEach( (band: string) => {
          this.bands[band] = true;
        });
      }
      if (res.layers) {
        const layers = Object.values(res.layers).slice(0, (Object.values(res.layers).length - 1));
        const layer = layers.filter( lyr => lyr['options'].alt === 'timeSeries')[0] as Layer;
        this.latLng = layer['_latlng'];
      }
    });
  }

  viewGraphic() {
    this.graphicShow = true;
  }
}
