import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AuthState } from '../../auth/auth.state';
import { Store, select } from '@ngrx/store';
import { Logout } from '../../auth/auth.action';
import { AboutComponent } from 'src/app/shared/components/about/about.component';

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
    public router: Router,
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
    const url = this.router.url;
    window.location.href = `${window['__env'].urlOauthApp}/auth/${window['__env'].appName}/login?url=${url}`;
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

  /**
   * Open About component
   */
  openAbout() {
    this.dialog.open(AboutComponent, {
      width: '750px'
    });
  }
}
