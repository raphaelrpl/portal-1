import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatIconModule,
  MatSelectModule
} from '@angular/material';

import { SelectLangComponent } from './components/selectLang/selectLang.component';

@NgModule({
  declarations: [
    SelectLangComponent
  ],
  exports: [
    SelectLangComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ]
})
export class SharedModule { }
