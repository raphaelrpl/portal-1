import { BdcLayerWFS } from './layer.interface';

/**
 * return a list of grids from the BDC project
 * static WFS list
 */
export const Grids: BdcLayerWFS[] = [
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
];
