import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatSelectModule,
  MatSidenavModule,
  MatExpansionModule,
  MatRadioModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSlideToggleModule,
  MatSliderModule,
  MatSnackBarModule,
  MatBottomSheetModule,
  MatCheckboxModule
} from '@angular/material';
import { ChartsModule } from 'ng2-charts';

import { ExploreComponent } from './explore.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MapComponent } from './map/map.component';
import { SliderComponent } from './map/slider/slider.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchComponent } from './sidenav/search/search.component';
import { TimeSeriesComponent } from './map/timeSeries/timeSeries.component';
import { FormsModule } from '@angular/forms';
import { CollectionComponent } from './sidenav/collection/collection.component';
import { StoreModule } from '@ngrx/store';
import { Ng5SliderModule } from 'ng5-slider';
import * as fromExplore from './explore.reducer';
import { BoxTimeSeriesComponent } from './map/timeSeries/box/box.component';


/**
 * Explore Module
 * Module for managing components and service of map pages
 */
@NgModule({
  declarations: [
    ExploreComponent,
    ToolbarComponent,
    MapComponent,
    SidenavComponent,
    SearchComponent,
    CollectionComponent,
    SliderComponent,
    TimeSeriesComponent,
    BoxTimeSeriesComponent
  ],
  exports: [
    RouterModule
  ],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSelectModule,
    MatSidenavModule,
    HttpClientModule,
    MatExpansionModule,
    MatRadioModule,
    MatBottomSheetModule,
    MatInputModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    Ng5SliderModule,
    MatCheckboxModule,
    ChartsModule,
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot(),
    StoreModule.forRoot({
      explore: fromExplore.reducer
    })
  ],
  entryComponents: [
    BoxTimeSeriesComponent
  ]
})
export class ExploreModule { }
