import { LeafletModule } from '@asymmetrik/ngx-leaflet';
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
  MatNativeDateModule
} from '@angular/material';
// import { AgmCoreModule } from '@agm/core';

import { ExploreComponent } from './explore.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MapComponent } from './map/map.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchComponent } from './sidenav/search/search.component';
import { FormsModule } from '@angular/forms';
import { CollectionComponent } from './sidenav/collection/collection.component';

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
    CollectionComponent
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
    MatInputModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    //AgmCoreModule.forRoot({
    //  apiKey: 'CHAVES_GOOGLE_MAPS'
    //}),
    LeafletModule.forRoot()
  ]
})
export class ExploreModule { }
