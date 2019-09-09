import { Component, EventEmitter, Output } from '@angular/core';
import { LoginComponent } from '../../auth/login/login.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AuthState } from '../../auth/auth.state';
import { Store, select } from '@ngrx/store';
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

  /** if is logged */
  public logged = false;

  /** subscribe in store */
  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private store: Store<AuthState>) {
    this.store.pipe(select('auth')).subscribe(res => {
      this.logged = res.userId && res.token;
    });
  }

  /** pointer to issue event to explore component */
  @Output() toggleToEmit = new EventEmitter();

  /**
   * emit event to explore when click in menu icon
   */
  toggleDrawer() {
    this.toggleToEmit.emit();
  }

  /**
   * Open Login Dialog
   */
  openLogin() {
    this.dialog.open(LoginComponent, {
      width: '400px',
      restoreFocus: false,
      disableClose: true
    });
  }

  /**
   * Logout in application
   */
  logout() {
    this.logged = false;
    this.store.dispatch(Logout());
    this.snackBar.open('Logout Successfully!', '', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: 'app_snack-bar-success'
    });
  }
}
