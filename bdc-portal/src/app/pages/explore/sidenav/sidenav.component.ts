import { Component } from '@angular/core';

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

  changeStep(value: number) {
    this.step = value
  }

}
