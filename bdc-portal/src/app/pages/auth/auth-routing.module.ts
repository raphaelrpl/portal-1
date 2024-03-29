import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RedirectLoginComponent } from './redirect-login/redirect-login.component';

const routes: Routes = [
  { path: 'redirect', component: RedirectLoginComponent }
];

/**
 * Auth Route Module
 * redirects to authentication components with 'auth' before URL
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
