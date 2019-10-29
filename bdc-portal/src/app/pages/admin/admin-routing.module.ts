import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListCubesComponent } from './cubes/list-cubes/list-cubes.component';
import { CreateCubeComponent } from './cubes/create-cube/create-cube.component';
import { UploadSampleComponent } from './samples/upload-sample/upload-sample.component';
import { CreateClassificationSystemComponent } from './samples/create-classification-system/create-classification-system.component';


const routes: Routes = [
  { path: '', redirectTo: '/admin/cubes', pathMatch: 'full' },
  { path: 'cubes', component: ListCubesComponent },
  { path: 'cubes/create', component: CreateCubeComponent },
  { path: 'samples/upload', component: UploadSampleComponent },
  { path: 'samples/classification_system/create', component: CreateClassificationSystemComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
