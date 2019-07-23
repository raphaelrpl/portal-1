import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Collection } from './collection.interface';
import { ExploreState } from '../../explore.state';
// import { Observable } from 'rxjs';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {

  public collections: Collection[];

  constructor(private store: Store<ExploreState>) {
    // this.collections = this.store.select(state => state.collections);
    this.store.pipe(select(state => state.collections))
      .subscribe(cls => {
        this.collections = cls;
      });
  }

  ngOnInit() {
  }

}
