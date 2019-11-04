import { BdcGrid } from './layer.interface';

/**
 * return a list of grids from the BDC project
 */
export const Grids: BdcGrid[] = [
   {
      id: 'aea_500k',
      enabled: false,
      name: 'WFI',
      layer: null,
      filter: true
   },
   {
      id: 'aea_250k',
      enabled: true,
      name: '250k',
      layer: null,
      filter: true
   },
   {
      id: 'mgrs',
      enabled: false,
      name: 'MGRS',
      layer: null,
      filter: false
   },
   {
      id: 'wrs',
      enabled: false,
      name: 'WRS',
      layer: null,
      filter: false
   },
   {
      id: 'ibge_biomas',
      enabled: false,
      name: 'Biomas',
      layer: null,
      style: 'biomas',
      filter: false
   }
];
