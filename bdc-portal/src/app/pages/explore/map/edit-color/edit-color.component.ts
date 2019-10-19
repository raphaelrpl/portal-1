import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ExploreState } from '../../explore.state';
import { Feature } from '../../sidenav/collection/collection.interface';
import { setEditFeature } from '../../explore.action';

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
    public feature: Feature = null;
    public bandsAvailable = [];
    public red = '';
    public green = '';
    public blue = '';
    public saturation = null;
    public gamma = null;
    public sigmoidal = null;
    
    // private urlBDCTiler = window['__env'].urlBDCTiler;
    
    constructor(private store: Store<ExploreState>) {
        this.store.pipe(select('explore')).subscribe(res => {
            if(res.featureEdit && res.featureEdit.id) {
                this.feature = res.featureEdit;
                if (this.feature['composite']) {
                    this.red = this.feature['composite']['bands'].red;
                    this.green = this.feature['composite']['bands'].green;
                    this.blue = this.feature['composite']['bands'].blue;
                } else {
                    this.reset();
                }
                this.setBandsAvailable();
            } else {
                this.feature = null;
            }
        });
    }

    setBandsAvailable() {
        this.bandsAvailable = Object.keys(this.feature.assets).filter(key => key != 'thumbnail');
    }

    reset() {
        this.saturation = 2;
        this.gamma = 4.5;
        this.sigmoidal = 15;
        this.red = 'red';
        this.green = 'green';
        this.blue = 'blue';
    }

    closeBox() {
        this.store.dispatch(setEditFeature({}))
    }

    compositeImage() {
        // composite new image by bands and formula
    }
}
