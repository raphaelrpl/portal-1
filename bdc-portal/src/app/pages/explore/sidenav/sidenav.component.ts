import { Component } from '@angular/core';
import { Feature } from './collection/collection.interface';
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

  /** step menu opened of the sidenav */
  public step = 0;
  /** features selected by search in this period */
  public features$: Feature[] = [];

  /** get infos by store application */
  constructor(private store: Store<ExploreState>) {
    this.store.pipe(select('explore')).subscribe(res => {
      if (res.features) {
        this.features$ = Object.values(res.features).slice(0, (Object.values(res.features).length - 1)) as Feature[];
      }
    });
  }

  /** change menu opened */
  changeStep(value: number) {
    this.step = value;
  }

}
