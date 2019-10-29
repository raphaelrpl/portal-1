import { Component } from '@angular/core';

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
  public logged = true;
  /** if display box to search */
  public viewBox = false;

  /** display box to search */
  public showBox() {
    this.viewBox = true;
  }

  /** close/diable box of the page */
  public closeBox() {
    this.viewBox = false;
  }

}
