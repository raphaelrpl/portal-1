import { Component, OnInit, Input } from '@angular/core';
import { tileLayer, latLng } from 'leaflet';

@Component({
  selector: 'base-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  public options: Object = {}

  @Input() width: any;
  @Input() height: any;

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
