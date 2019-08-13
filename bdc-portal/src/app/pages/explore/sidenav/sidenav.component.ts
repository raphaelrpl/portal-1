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

  public step = 0;
  public features$: Feature[] = [];

  constructor(private store: Store<ExploreState>) {
    this.store.pipe(select('explore')).subscribe(res => {
      if (res.features) {
        this.features$ = Object.values(res.features).slice(0, (Object.values(res.features).length - 1)) as Feature[];
      }
    });
  }

  changeStep(value: number) {
    this.step = value;
  }

}
