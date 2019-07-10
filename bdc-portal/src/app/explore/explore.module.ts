import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  MatButtonModule,
  MatToolbarModule,
  MatIconModule
} from '@angular/material';

import { ExploreComponent } from './explore.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [
    ExploreComponent,
    NavigationComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    LeafletModule
  ]
})
export class ExploreModule { }
