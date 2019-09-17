import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AuthState } from 'src/app/pages/auth/auth.state';
import { AuthService } from 'src/app/pages/auth/auth.service';

/**
 * Map initial Catalog component
 * component to active search box of the catalog
 */
@Component({
  selector: 'app-map-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent {

  /** if user logged */
  public logged = false;
  /** if display box to search */
  public viewBox = false;

  /** select data of the store application */
  constructor(
    private as: AuthService,
    private store: Store<AuthState>) {
    this.store.pipe(select('auth')).subscribe(res => {
      if (res.userId && res.token) {
        this.checkAuthorization();
      } else {
        this.logged = false;
      }
    });
  }

  /** display box to search */
  public showBox() {
    this.viewBox = true;
  }

  /** close/diable box of the page */
  public closeBox() {
    this.viewBox = false;
  }

  public async checkAuthorization() {
    try {
      const response = await this.as.token('bdc_portal:catalog:read');
      if (response) {
        this.logged = true;
      }
    } catch (err) {}
  }
}
