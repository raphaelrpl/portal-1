import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExploreModule } from './pages/explore/explore.module';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from './shared/shared.module';
import * as fromApp from './app.reducer';
import * as fromAuth from './pages/auth/auth.reducer';
import * as fromExplore from './pages/explore/explore.reducer';
import { AdminModule } from './pages/admin/admin.module';
import { APP_BASE_HREF } from '@angular/common';

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

/**
 * Initial Module of Application (SPA)
 */
@NgModule({
  providers: [{
    provide: APP_BASE_HREF, useValue: '/portal/'
  }],
  declarations: [
    AppComponent
  ],
  exports: [
    TranslateModule
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    ExploreModule,
    AdminModule,
    StoreModule.forRoot({
      app: fromApp.reducer,
      auth: fromAuth.reducer,
      explore: fromExplore.reducer
    }),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/portal/assets/i18n/', '.json');
}