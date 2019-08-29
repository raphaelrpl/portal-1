import { Component } from '@angular/core';
import { Feature } from '../../sidenav/collection/collection.interface';
import { Store, select } from '@ngrx/store';
import { ExploreState } from '../../explore.state';
import { BoxTimeSeriesComponent } from './box/box.component';
import { MatBottomSheet } from '@angular/material';
import { Marker, LatLngBounds, LatLng } from 'leaflet';
import { setLayers, removeGroupLayer } from '../../explore.action';

/**
 * Map initial TimeSeries component
 * component to active time series of the cube
 */
@Component({
  selector: 'app-map-timeseries',
  templateUrl: './timeSeries.component.html',
  styleUrls: ['./timeSeries.component.scss']
})
export class TimeSeriesComponent {

  /** status of the activation function in the map */
  public actived = false;
  /** features selected in search */
  public features$: Feature[] = [];
  /** center (lat/lng) of map */
  private center: LatLng;
  /** layer maker */
  private layerMaker: Marker;

  /** select data of the store application */
  constructor(
    private bottomSheet: MatBottomSheet,
    private store: Store<ExploreState>) {
    this.store.pipe(select('explore')).subscribe(res => {
      if (res.features) {
        this.features$ = Object.values(res.features).slice(0, (Object.values(res.features).length - 1)) as Feature[];
      }
      if (res.positionMap) {
        const position = new LatLngBounds(res.positionMap['_southWest'], res.positionMap['_northEast']);
        this.center = position.getCenter();
      }
    });
  }

  /** active function in the map */
  public active() {
    if (!this.actived) {
      this.actived = true;
      this.layerMaker = new Marker(this.center, {
        draggable: true,
        alt: 'timeSeries'
      });
      this.store.dispatch(setLayers([this.layerMaker]));
    }
  }

  /** disabled function in the map */
  public desactive() {
    this.store.dispatch(removeGroupLayer({
      key: 'alt',
      prefix: 'timeSeries'
    }));
    this.actived = false;
  }

  /** active box with graphic in the window */
  public showBox() {
    this.bottomSheet.open(BoxTimeSeriesComponent, {
      data: {
        latLng: this.layerMaker.getLatLng()
      }
    });
  }
}
