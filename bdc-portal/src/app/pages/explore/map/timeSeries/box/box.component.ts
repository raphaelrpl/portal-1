import { Component, ChangeDetectorRef } from '@angular/core';
import { ExploreState } from '../../../explore.state';
import { Store, select } from '@ngrx/store';
import { Layer, LatLng } from 'leaflet';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { formatDateUSA } from 'src/app/shared/helpers/date';
import { showLoading, closeLoading } from '../../../explore.action';
import { MatSnackBar } from '@angular/material';
import { TimeSeriesService } from '../timeSeries.service';
import { colorsByBand } from 'src/app/shared/helpers/CONSTS';

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
  /** bands name */
  public listBands: string[];
  /** lat lng of point */
  public latLng: LatLng;
  /** cube name selected */
  public collection: string;
  /** type of cube selected (MEDIAN, STACK, ...) */
  public subCollection: string;
  /** period (start-end) selected in search */
  public rangeTemporal: string[];

  /** visible status of the graphic */
  public graphicShow = false;
  /** properties of graphic */
  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {} as any;
  public lineChartColors: Color[] = [];
  public lineTension = false;

  /** get infos in store to display in the component */
  constructor(
    private snackBar: MatSnackBar,
    private store: Store<ExploreState>,
    private ref: ChangeDetectorRef,
    private ts: TimeSeriesService) {
    this.store.pipe(select('explore')).subscribe(res => {
      if (res.bands) {
        this.listBands = Object.values(res.bands).slice(0,
          (Object.values(res.bands).length - 1)).filter(band => band !== 'quality') as string[];
        this.listBands.forEach( (band: string) => {
          if (this.bands[band] === undefined) {
            this.bands[band] = true;
          }
        });
      }
      if (res.features) {
        const features = Object.values(res.features).slice(0, (Object.values(res.features).length - 1));
        this.collection = features[0]['collection'];
        this.subCollection = features[0]['properties']['bdc:time_aggregation'];
      }
      if (Object.values(res.rangeTemporal).length) {
        this.rangeTemporal = [
          formatDateUSA(new Date(res.rangeTemporal['0'])),
          formatDateUSA(new Date(res.rangeTemporal['1']))
        ];
      }
      if (res.layers) {
        const layers = Object.values(res.layers).slice(0, (Object.values(res.layers).length - 1));
        const layer = layers.filter( lyr => lyr['options'].alt === 'timeSeries')[0] as Layer;
        this.latLng = layer['_latlng'];
      }
    });
  }

  /** search time series in WTSS and plot result in graphic */
  async search() {
    try {
      this.store.dispatch(showLoading());

      const bands = Object.keys(this.bands).filter(band => this.bands[band] === true);
      if (!bands.length) {
        this.snackBar.open('select at least one band', '', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: 'app_snack-bar-error'
        });

      } else {
        let query = `?coverage=bdc:${this.collection}:${this.subCollection}`;
        query += `&latitude=${this.latLng.lat}`;
        query += `&longitude=${this.latLng.lng}`;
        query += `&start_date=${this.rangeTemporal[0]}`;
        query += `&end_date=${this.rangeTemporal[1]}`;
        query += `&attributes=${Object.values(bands)}`;

        const response = await this.ts.getTimeSeriesWTSS(query);
        if (response.result) {
          // set data
          this.lineChartData = response.result.attributes.map( bandValues => {
            return {
              data: bandValues.values,
              label: bandValues.attribute,
              lineTension: 0
            };
          });
          // set labels
          this.lineChartLabels = response.result.timeline.map(date => formatDateUSA(new Date(date)));
          this.lineChartOptions = { responsive: true } as any;
          // set colors
          this.lineChartColors = Object.values(bands).map(band => colorsByBand[band] || {
            borderColor: '#111109',
            backgroundColor: 'rgba(0,0,0,0)'
          });
          // update graphic
          this.graphicShow = true;
          this.ref.detectChanges();

        } else {
          throw Error('');
        }
      }

    } catch (err) {
      const msg = err.error && err.error.message || 'INCORRECT SEARCH IN WTSS';
      this.snackBar.open(msg, '', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: 'app_snack-bar-error'
      });

    } finally {
      this.store.dispatch(closeLoading());
    }
  }

  /** enable or disabled line tension in the graphic */
  changeLineTension() {
    this.lineChartData = this.lineChartData.map( bandValues => {
      return {...bandValues, lineTension: this.lineTension ? 0.4 : 0};
    });
    this.ref.detectChanges();
  }
}
