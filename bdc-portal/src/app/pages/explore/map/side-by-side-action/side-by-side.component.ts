import { Component } from '@angular/core';
import { Feature } from '../../sidenav/collection/collection.interface';
import { Store, select } from '@ngrx/store';
import { ExploreState } from '../../explore.state';
import { MatBottomSheet } from '@angular/material';

/**
 * Map initial Side by Side component
 * component to active side_by_side effects
 */
@Component({
  selector: 'app-map-side-by-side',
  templateUrl: './side-by-side.component.html',
  styleUrls: ['./side-by-side.component.scss']
})
export class SideBySideComponent {

  /** features selected in search */
  public features: Feature[] = [];

  /** select data of the store application */
  constructor(
    private bottomSheet: MatBottomSheet,
    private store: Store<ExploreState>) {
    this.store.pipe(select('explore')).subscribe(res => {
      if (res.features) {
        this.features = Object.values(res.features).slice(0, (Object.values(res.features).length - 1)) as Feature[];
      }
    });
  }

}
