import { BdcGrid } from './layer.interface';

/**
 * return a list of grids from the BDC project
 */
export const Grids: BdcGrid[] = [
   {
      id: 'aea_500k',
      enabled: true,
      name: 'WFI',
      layer: null,
      filter: true
   },
   {
      id: 'aea_250k',
      enabled: false,
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
   }
];
