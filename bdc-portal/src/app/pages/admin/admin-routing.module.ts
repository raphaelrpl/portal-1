import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListCubesComponent } from './list-cubes/list-cubes.component';


const routes: Routes = [
  { path: '', redirectTo: '/admin/cubes', pathMatch: 'full' },
  { path: 'cubes', component: ListCubesComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
