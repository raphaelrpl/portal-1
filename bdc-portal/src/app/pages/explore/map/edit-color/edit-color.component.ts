import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ExploreState } from '../../explore.state';
import { Feature } from '../../sidenav/collection/collection.interface';

/**
 * Map EDIT COLOR component
 * component to manage color tif of the map
 */
@Component({
  selector: 'app-map-edit-color',
  templateUrl: './edit-color.component.html',
  styleUrls: ['./edit-color.component.scss']
})
export class EditColorComponent {

    /** all features */
    private features: Feature[] = [];
    public visible = false;
    public bands = ['RED', 'GREEN', 'BLUE'];

    private urlBDCTiler = window['__env'].urlBDCTiler;

    constructor(private store: Store<ExploreState>) {
        this.store.pipe(select('explore')).subscribe(res => {
        });
    }

    closeBox() {
        this.visible = false;
    }

  
}
