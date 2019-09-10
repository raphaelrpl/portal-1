import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListCubesComponent } from './cubes/list-cubes/list-cubes.component';
import { CreateCubeComponent } from './cubes/create-cube/create-cube.component';


const routes: Routes = [
  { path: '', redirectTo: '/admin/cubes', pathMatch: 'full' },
  { path: 'cubes', component: ListCubesComponent },
  { path: 'cubes/create', component: CreateCubeComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
