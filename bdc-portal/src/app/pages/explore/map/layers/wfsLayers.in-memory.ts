import { BdcLayersWFS } from './layer.interface';

export const Grids: BdcLayersWFS[] = [
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
