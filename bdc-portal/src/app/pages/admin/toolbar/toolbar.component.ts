import { Component, EventEmitter, Output } from '@angular/core';
import { LoginComponent } from '../../auth/login/login.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AuthState } from '../../auth/auth.state';
import { Store, select } from '@ngrx/store';
import { Logout } from '../../auth/auth.action';
import { Router } from '@angular/router';

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
  constructor(
    private snackBar: MatSnackBar,
    public router: Router,
    private store: Store<AuthState>) {}

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
    this.router.navigate(['/explore']);
    this.snackBar.open('Logout Successfully!', '', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: 'app_snack-bar-success'
    });
  }
}
