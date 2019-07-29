import { Component } from '@angular/core';
import { Collection } from './collection/collection.interface';
import { Store, select } from '@ngrx/store';
import { ExploreState } from '../explore.state';

/**
 * Sidenav component
 * simple static component
 */
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  public step: number = 0;
  public collections$: Collection[] = [];

  constructor(private store: Store<ExploreState>) {
    this.store.pipe(select('explore')).subscribe(res => {
      if (res.collections) {
        this.collections$ = <Collection[]>Object.values(res.collections).slice(0, (Object.values(res.collections).length-1));
      }
    });
  }

  changeStep(value: number) {
    this.step = value
  }

}
