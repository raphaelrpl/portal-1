import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from './app.state';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

/**
 * First application component
 * has only 'router-outlet'
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  /** subscribe in store app */
  constructor(
    public translate: TranslateService,
    private store: Store<AppState>,
    private spinner: NgxSpinnerService) {

    translate.setDefaultLang('en');

    this.store.pipe(select('app')).subscribe(res => {
      if (res.loading) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    });
  }
}
