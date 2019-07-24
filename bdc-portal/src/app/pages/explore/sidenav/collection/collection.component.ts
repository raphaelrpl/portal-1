import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Collection } from './collection.interface';
import { ExploreState } from '../../explore.state';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent {

  public collections$: Collection[] = [];

  constructor(private store: Store<ExploreState>) {
    this.store.pipe(select('explore')).subscribe(res => {
      if (res.collections[0]) {
        this.collections$.push(res.collections[0]);
      }
    });
  }


}
