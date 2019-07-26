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
      if (res.collections) {
        this.collections$ = <Collection[]>Object.values(res.collections).slice(0, (Object.values(res.collections).length-1));
      }
    });
  }

  getDateFormated(dateStr: string) {
    let date = new Date(dateStr)
    return date.toLocaleDateString()
  }

}
