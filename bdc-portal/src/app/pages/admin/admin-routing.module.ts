import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CubesComponent } from './cubes/cubes.component';


const routes: Routes = [
  { path: '', redirectTo: '/admin/cubes', pathMatch: 'full' },
  { path: 'cubes', component: CubesComponent }
];

/**
 * Admin Route Module
 * redirects to administrator dashboard components with 'admin' before URL
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
