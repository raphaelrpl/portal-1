import { Component, EventEmitter, Output } from '@angular/core';
import { AuthState } from '../../auth/auth.state';
import { Store } from '@ngrx/store';
import { Logout } from '../../auth/auth.action';

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

  /** subscribe in store */
  constructor(private store: Store<AuthState>) {}

  /** pointer to issue event to explore component */
  @Output() toggleToEmit = new EventEmitter();

  /**
   * emit event to explore when click in menu icon
   */
  toggleDrawer() {
    this.toggleToEmit.emit();
  }

  /**
   * Logout in application and redirect to explore page
   */
  logout() {
    this.store.dispatch(Logout());
    this.goMap();
  }

  /**
   * Logout in application and redirect to explore page
   */
  goMap() {
    window.location.href = `${window.location.origin}/portal/explore`;
  }
}
