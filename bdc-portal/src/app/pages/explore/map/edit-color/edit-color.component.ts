import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ExploreState } from '../../explore.state';
import { Feature } from '../../sidenav/collection/collection.interface';
import { setEditFeature, removeGroupLayer, setLayers, setFeaturesPeriod, setFeatures } from '../../explore.action';
import * as L from 'leaflet';

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
    public features: Feature[];
    public bandsAvailable = [];
    public red = '';
    public green = '';
    public blue = '';
    public saturation = null;
    public gamma = null;
    public sigmoidal = null;
    public actived = true;
    
    private urlBDCTiler = window['__env'].urlBDCTiler;
    
    constructor(private store: Store<ExploreState>) {
        this.store.pipe(select('explore')).subscribe(res => {
            if (res.featureEdit && res.featureEdit.id) {
                if (!this.feature || res.featureEdit.id !== this.feature.id) {
                    this.feature = res.featureEdit;
                    if (this.feature['composite']) {
                        this.red = this.feature['composite']['bands'].red;
                        this.green = this.feature['composite']['bands'].green;
                        this.blue = this.feature['composite']['bands'].blue;
                        this.gamma = this.feature['composite']['gamma'];
                        this.saturation = this.feature['composite']['saturation'];
                        this.sigmoidal = this.feature['composite']['sigmoidal'];
                    } else {
                        this.reset();
                    }
                    this.setBandsAvailable();
                }
            } else {
                this.feature = null;
            }
            if (res.features) {
                this.features = Object.values(res.features).slice(0, Object.values(res.features).length-1) as Feature[];
                this.actived = !this.features.length || (this.features[0] && this.features[0]['enabled'] !== false);
            }
        });
    }

    setBandsAvailable() {
        this.bandsAvailable = Object.keys(this.feature.assets).filter(key => key != 'thumbnail');
    }

    reset() {
        this.saturation = 2;
        this.gamma = 4.5;
        this.sigmoidal = 10;
        this.red = 'red';
        this.green = 'green';
        this.blue = 'blue';
    }

    closeBox() {
        this.store.dispatch(setEditFeature({}));
    }

    compositeImage() {
        // remove images displayed
        this.store.dispatch(removeGroupLayer({
            key: 'className',
            prefix: `cube_${this.feature.id}`
        }));

        // plot features
        let layerTile = null;
        const featSelectedEdited = this.features.map( (f: any) => {
            if (this.feature && this.feature.id === f.id) {
                const bands = `${this.red},${this.green},${this.blue}`;
                const color_formula = `Gamma RGB ${this.gamma} Saturation ${this.saturation} Sigmoidal RGB ${this.sigmoidal} 0.35`;
    
                if (this.actived) {
                    let url = `${this.urlBDCTiler}/${f.id}/{z}/{x}/{y}.png`;
                    url += `?bands=${bands}&color_formula=${color_formula}`;
                    layerTile = new L.TileLayer(url, {
                        className: `cube_${f.id}`,
                        attribution: `Brazil Data Cube`
                    });
                }
    
                return {
                    ...f, 
                    composite: {
                        bands: {
                            red: this.red,
                            green: this.green,
                            blue: this.blue,
                        },
                        gamma: this.gamma,
                        saturation: this.saturation,
                        sigmoidal: this.sigmoidal
                    } 
                };
            } else {
                return f;
            }
        });

        setTimeout( _ => {
            this.store.dispatch(setFeatures(featSelectedEdited));
            if (layerTile) {
                this.store.dispatch(setLayers([layerTile]));
            }
        });
    }

    /** convert date to USA format */
    public getDateFormated(dateStr: string): string {
        const dates = dateStr.split('/');
        const startDate = (new Date(dates[0])).toLocaleDateString();
        return `${startDate}`;
    }
}
