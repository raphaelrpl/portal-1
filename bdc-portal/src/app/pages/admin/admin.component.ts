import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';


@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  /** component reference sidenav */
  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;

  /**
   * toggleDrawer - enable or disable the side menu of the map page
   */
  toggleDrawer() {
    this.sidenav.toggle();
  }
}
