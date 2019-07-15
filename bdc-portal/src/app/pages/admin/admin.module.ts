import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CubesComponent } from './cubes/cubes.component';
import { AdminRoutingModule } from './admin-routing.module';

/**
 * Admin Module
 * Module for managing components and service of administrator dashboard pages
 */
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
