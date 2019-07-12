import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatIconModule,
  MatSelectModule
} from '@angular/material';

import { SelectLangComponent } from './components/selectLang/selectLang.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    SelectLangComponent,
    FooterComponent
  ],
  exports: [
    SelectLangComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ]
})
export class SharedModule { }
