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
  MatCheckboxModule,
  MatMenuModule
} from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChartsModule } from 'ng2-charts';
import { NgxPaginationModule } from 'ngx-pagination';

import { ExploreComponent } from './explore.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MapComponent } from './map/map.component';
import { SliderComponent } from './map/slider/slider.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchComponent } from './sidenav/search/search.component';
import { TimeSeriesComponent } from './map/timeSeries/timeSeries.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CollectionComponent } from './sidenav/collection/collection.component';
import { Ng5SliderModule } from 'ng5-slider';
import { BoxTimeSeriesComponent } from './map/timeSeries/box/box.component';
import { AuthModule } from '../auth/auth.module';
import { CatalogComponent } from './map/catalog/catalog.component';
import { BoxCatalogComponent } from './map/catalog/box/box.component';
import { CatalogResultsComponent } from './map/catalog/box/results/results.component';
import { SampleComponent } from './sidenav/sample/sample.component';
import { EditColorComponent } from './map/edit-color/edit-color.component';
import { SideBySideComponent } from './map/side-by-side-action/side-by-side.component';


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
    SampleComponent,
    CatalogComponent,
    BoxCatalogComponent,
    CatalogResultsComponent,
    EditColorComponent,
    SliderComponent,
    TimeSeriesComponent,
    SideBySideComponent,
    BoxTimeSeriesComponent
  ],
  exports: [
    RouterModule
  ],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    AuthModule,
    DragDropModule,
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
    ReactiveFormsModule,
    MatDatepickerModule,
    MatMenuModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    Ng5SliderModule,
    MatCheckboxModule,
    NgxPaginationModule,
    ChartsModule,
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot()
  ],
  entryComponents: [
    BoxTimeSeriesComponent
  ]
})
export class ExploreModule { }
