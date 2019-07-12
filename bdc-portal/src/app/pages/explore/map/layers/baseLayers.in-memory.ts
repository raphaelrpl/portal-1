import { tileLayer } from 'leaflet';
import { Layer, LayerId } from './layer.interface';

export const BaseLayers: Layer[] = [
   // Google Satellite
   {
      id: 'google_sattelite',
      enabled: false,
      name: 'Google Satellite',
      layer: tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
         subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }),
   },
   // Google Hybrid
   {
      id: 'google_hybrid',
      enabled: false,
      name: 'Google Hybrid',
      layer: tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
         subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }),
   },
   // Google Streets
   {
      id: 'google_streets',
      enabled: false,
      name: 'Google Streets',
      layer: tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
         subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }),
   },
   // Google Terrain
   {
      id: 'google_terrain',
      enabled: false,
      name: 'Google Terrain',
      layer: tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
         subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }),
   },
   // OSM
   {
      id: 'osm',
      enabled: true,
      name: 'OSM',
      layer: tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }),
   },
   // OSM TOPO
   {
      id: 'osm_topo',
      enabled: false,
      name: 'OSM TOPO',
      layer: tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }),
   },
   // BLANK
   {
      id: '',
      enabled: false,
      name: 'Blank',
      layer: tileLayer('', {})
   }
];

export const OverlayersId: LayerId[] = [
   {
      ds: 'grids',
      title: 'aea_500k',
      enabled: true,
      name: 'WFI'
   },
   {
      ds: 'grids',
      title: 'aea_250k',
      enabled: false,
      name: '250k'
   }
   // {
   //    id: 'll_WFI',
   //    enabled: false,
   //    name: 'll_WFI',
   //    layer: tileLayer.wms('http://cbers1.dpi.inpe.br:8095/geoserver/ows?', {
   //       layers: 'grids:aea_500k',
   //       format: 'image/png',
   //       transparent: true
   //    }),
   // }
];
