import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

import { init as initApm } from 'elastic-apm-js-base';
initApm({
  serviceName: 'oauth_app',
  logLevel: 'error',
  active: false,
  serverUrl: window['__env'].urlAPMServer,
})

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
