import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';


const routes: Routes = [
  { path: '', redirectTo: '/cubes', pathMatch: 'full' },
  { path: 'cubes', component: AdminComponent, loadChildren: './cubes/cubes.module#CubesModule' },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
