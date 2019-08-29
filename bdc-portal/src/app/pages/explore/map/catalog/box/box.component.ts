import { Component, Input, EventEmitter, Output } from '@angular/core';

/**
 * Map Search Catalog component
 * component to search images of the catalog
 */
@Component({
  selector: 'app-box-catalog',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxCatalogComponent {

  @Input('visible') visible: boolean;

  @Output() toggleToEmit = new EventEmitter();

  /** select data of the store application */
  constructor(){
  }

  public closeBox() {
    this.toggleToEmit.emit();
  }
}
