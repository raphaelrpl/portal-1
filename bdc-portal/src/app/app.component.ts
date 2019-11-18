import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from './app.state';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { MatBottomSheet } from '@angular/material';
import { SupportersComponent } from './shared/components/supporters/supporters.component';

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
    private _bottomSheet: MatBottomSheet,
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

    this._bottomSheet.open(SupportersComponent);
  }
}
