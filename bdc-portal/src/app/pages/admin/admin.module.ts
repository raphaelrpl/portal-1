import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CubesComponent } from './cubes/cubes.component';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [
    CubesComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
