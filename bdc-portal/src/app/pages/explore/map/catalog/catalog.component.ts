import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AuthState } from 'src/app/pages/auth/auth.state';

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

  public logged = false;

  /** select data of the store application */
  constructor(
    private store: Store<AuthState>) {
    this.store.pipe(select('auth')).subscribe(res => {
      this.logged = res.userId && res.token;
    });
  }
}
