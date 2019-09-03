import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListComponent } from './list/list.component';
import { CubesRoutingModule } from './cubes-routing.module';


@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    CubesRoutingModule
  ]
})
export class CubesModule { }
