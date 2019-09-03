import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { CatalogService } from './../catalog.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { ExploreState } from '../../../explore.state';
import { formatDateUSA } from 'src/app/shared/helpers/date';
import { MatSnackBar } from '@angular/material';
import { showLoading, closeLoading } from 'src/app/app.action';
import { AppState } from 'src/app/app.state';
import { removeGroupLayer } from '../../../explore.action';

/**
 * Map Search Catalog component
 * component to search images of the catalog
 */
@Component({
  selector: 'app-box-catalog',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxCatalogComponent implements OnInit {

  /** if visible box in the component */
  @Input('visible') visibleBox: boolean;
  /** pointer to emit event to Catalog compoenent */
  @Output() toggleToEmit = new EventEmitter();

  public formSearch: FormGroup;
  /** list of providers */
  public providersObjects = {};
  /** list with title of the providers */
  public providersList = [];
  /** list collections */
  public collectionsList = [];
  /** list of providers selected */
  public providers = [];
  /** list of collections selected */
  public collections = [];
  /** items/features selected */
  public items: object[];
  /** bounding box used to search */
  public bbox = '';
  /** object with search information */
  public searchObj = {
    cloudCover: 50,
    startDate: null,
    lastDate: null
  };

  /** select data of the store application and set form validators */
  constructor(
    private cs: CatalogService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private storeApp: Store<AppState>,
    private store: Store<ExploreState>) {
      this.store.pipe(select('explore')).subscribe(res => {
        if (Object.values(res.actualRangeTemporal).length) {
          this.searchObj.startDate = this.searchObj.startDate || new Date(Object.values(res.actualRangeTemporal)[0] as any);
          this.searchObj.lastDate = this.searchObj.lastDate || new Date(Object.values(res.actualRangeTemporal)[1] as any);
        }
        if (res.bbox) {
          this.bbox = `${res.bbox['_southWest']['lng']},${res.bbox['_southWest']['lat']},${res.bbox['_northEast']['lng']},${res.bbox['_northEast']['lat']}`;
        }
      });
      this.formSearch = this.fb.group({
        providers: ['', [Validators.required]],
        collections: ['', [Validators.required]],
        startDate: ['', [Validators.required]],
        lastDate: ['', [Validators.required]],
        cloudCover: ['']
      });
  }

  /** send request to mount component */
  ngOnInit() {
    this.getProviders();
  }

  /** get providers available */
  private async getProviders() {
    try {
      const response = await this.cs.getProviders();
      this.providersObjects = response.providers;
      this.providersList = Object.keys(response.providers);
    } catch (err) {}
  }

  /** get collections by providers */
  public async getCollections() {
    try {
      this.collectionsList = [];
      this.collections = [];
      if (this.providers.length) {
        const response = await this.cs.getCollections(this.providers.join(','));
        Object.keys(response).forEach( provider => {
          Object.values(response[provider]).forEach( collection => {
            if (this.collectionsList.indexOf(`${provider}:${collection}`) < 0) {
              this.collectionsList.push(`${provider}:${collection}`);
            }
          });
        });
      }
    } catch (err) {}
  }

  /** disabled box/component */
  public closeBox() {
    this.searchObj.startDate = null;
    this.searchObj.lastDate = null;
    this.toggleToEmit.emit();
  }

  /** search features in stac_compose */
  public async search() {
    try {
      this.storeApp.dispatch(showLoading());
      if (this.formSearch.status !== 'VALID') {
        this.snackBar.open('Fill in all fields correctly!', '', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: 'app_snack-bar-error'
        });

      } else {
        if (!this.bbox) {
          this.snackBar.open('Select the Bounding Box!', '', {
            duration: 5000,
            verticalPosition: 'top',
            panelClass: 'app_snack-bar-error'
          });

        } else {
          this.store.dispatch(removeGroupLayer({
            key: 'alt',
            prefix: 'catalog'
          }));

          let query = `collections=${this.collections.join(',')}`;
          query += `&bbox=${this.bbox}`;
          query += `&time=${formatDateUSA(this.searchObj.startDate)}`;
          query += `/${formatDateUSA(this.searchObj.lastDate)}`;
          if (this.searchObj.cloudCover) {
            query += `&cloud_cover=${this.searchObj.cloudCover}`;
          }
          query += `&limit=100000`;

          const response = await this.cs.getItems(query);
          if (response.features.length) {
            this.items = response.features;

          } else {
            this.items = [];
            this.snackBar.open('Items not found!', '', {
              duration: 5000,
              verticalPosition: 'top',
              panelClass: 'app_snack-bar-error'
            });
          }
        }
      }

    } catch (err) {
    } finally {
      this.storeApp.dispatch(closeLoading());
    }
  }
}
