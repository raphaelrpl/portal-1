import { BdcLayer } from './layer.interface';

/**
 * return a list of grids from the BDC project
 */
export const Grids: BdcLayer[] = [
   {
      id: 'aea_500k',
      enabled: true,
      name: 'WFI',
      layer: null
   },
   {
      id: 'aea_250k',
      enabled: false,
      name: '250k',
      layer: null
   }
];
