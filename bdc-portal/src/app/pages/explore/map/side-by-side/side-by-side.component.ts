import { Component } from '@angular/core';
import { Feature } from '../../sidenav/collection/collection.interface';
import { Store, select } from '@ngrx/store';
import { ExploreState } from '../../explore.state';
import { MatDialog } from '@angular/material';
import { SideBySideBoxComponent } from './box/side-by-side-box.component';

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
  /** temporal step of the cube (quantity) */
  private tstep: string;
  /** temporal schema of the cube (monthly, year) */
  private tschema: string;

  /** select data in store application */
  constructor(
    private dialog: MatDialog,
    private store: Store<ExploreState>) {
      this.store.pipe(select('explore')).subscribe(res => {
        if (res.features) {
          this.features = Object.values(res.features).slice(0, (Object.values(res.features).length - 1)) as Feature[];
          this.tstep = res.tstep;
          this.tschema = res.tschema;
        }
      });
    }

  /**
   * Open box to view/manage side by side functionality
   */
  public openDialog() {
    this.dialog.open(SideBySideBoxComponent, {
      width: '95%',
      height: '95%',
      data: {
        features: this.features,
        tstep: this.tstep,
        tschema: this.tschema
      }
    });
  }

}
