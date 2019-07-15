import { Component, EventEmitter, Output } from '@angular/core';

/**
 * Toolbar component
 * top menu of the explore page
 */
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  /** pointer to issue event to explore component */
  @Output() toggleToEmit = new EventEmitter();

  /** emit event to explore when click in menu icon */
  toggleDrawer() {
    this.toggleToEmit.emit();
  }

}
