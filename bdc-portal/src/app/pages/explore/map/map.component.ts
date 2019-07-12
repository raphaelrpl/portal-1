import { Component, OnInit, Input } from '@angular/core';
import { tileLayer, latLng, MapOptions } from 'leaflet';

@Component({
  selector: 'app-base-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  public options: MapOptions;

  @Input() width: number;
  @Input() height: number;

  constructor() { }

  ngOnInit() {
    this.options = {
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      ],
      zoom: 5,
      center: latLng(46.879966, -121.726909)
    };
  }

}
