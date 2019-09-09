import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { AuthState } from '../auth/auth.state';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';


@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  /** select data of the store application */
  constructor(
    private store: Store<AuthState>,
    public router: Router) {
    this.store.pipe(select('auth')).subscribe(res => {
      if (!res.userId || !res.token) {
        this.router.navigate(['/explore']);
      }
    });
  }

  /** component reference sidenav */
  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;

  /**
   * toggleDrawer - enable or disable the side menu of the map page
   */
  toggleDrawer() {
    this.sidenav.toggle();
  }
}
