import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { CatalogService } from './../catalog.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { ExploreState } from '../../../explore.state';

/**
 * Map Search Catalog component
 * component to search images of the catalog
 */
@Component({
  selector: 'app-box-catalog',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxCatalogComponent implements OnInit{

  @Input('visible') visible: boolean;

  @Output() toggleToEmit = new EventEmitter();

  public formSearch: FormGroup;
  public providersObjects = {};
  public providersList = [];
  public collectionsList = [];
  public providers = [];
  public collections = [];
  public searchObj = {
    cloudCover: 50,
    startDate: null,
    lastDate: null
  }

  /** select data of the store application */
  constructor(
    private cs: CatalogService,
    private fb: FormBuilder,
    private store: Store<ExploreState>) {
      this.store.pipe(select('explore')).subscribe(res => {
        if (Object.values(res.actualRangeTemporal).length) {
          this.searchObj.startDate = new Date(Object.values(res.actualRangeTemporal)[0] as any);
          this.searchObj.lastDate = new Date(Object.values(res.actualRangeTemporal)[1] as any);
        }
    });
    this.formSearch = this.fb.group({
      providers: ['', [Validators.required]],
      collections: ['', [Validators.required]],
      startDate: [''],
      lastDate: [''],
      cloudCover: ['']
    });
  }

  ngOnInit() {
    this.getProviders();
  }

  private async getProviders() {
    try {
      let response = await this.cs.getProviders();
      this.providersObjects = response.providers;
      this.providersList = Object.keys(response.providers);
    } catch(err) {}
  }

  public async getCollections() {
    try {
      if (this.providers.length) {
        let response = await this.cs.getCollections(this.providers.join(','));
        Object.keys(response).forEach( provider => {
          Object.values(response[provider]).forEach( collection => {
            if (this.collectionsList.indexOf(collection) < 0) {
              this.collectionsList.push(collection);
            }
          })
        })
      }
    } catch(err) {}
  }

  public closeBox() {
    this.toggleToEmit.emit();
  }

  public async search() {
    try {
      console.log('search in catalog')

    } catch(err) {}
  }
}
