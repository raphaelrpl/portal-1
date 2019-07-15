import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExploreComponent } from './pages/explore/explore.component';

const routes: Routes = [
  { path: '', redirectTo: '/explore', pathMatch: 'full' },
  { path: 'explore', component: ExploreComponent },
  { path: 'auth', loadChildren: './pages/auth/auth.module#AuthModule'},
  { path: 'admin', loadChildren: './pages/admin/admin.module#AdminModule'}
];

/**
 * External Route Module (main)
 * has call to the explorer, authentication and administrator modules
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
