import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExploreComponent } from './pages/explore/explore.component';
import { AdminComponent } from './pages/admin/admin.component';

const routes: Routes = [
  { path: 'cubes', redirectTo: '/admin/cubes', pathMatch: 'full' },
  { path: 'explore', component: ExploreComponent },
  { path: 'auth', loadChildren: './pages/auth/auth.module#AuthModule'},
  { path: 'admin', component: AdminComponent, loadChildren: './pages/admin/admin.module#AdminModule'},
  { path: '', redirectTo: '/explore', pathMatch: 'full' },
  { path: '**', redirectTo: '/explore', pathMatch: 'full' }
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
