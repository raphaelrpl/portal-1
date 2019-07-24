import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatIconModule,
  MatSelectModule
} from '@angular/material';

import { SelectLangComponent } from './components/select-lang/select-lang.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormFieldErrorComponent } from './components/form-field-input/form-field-error.component';
import { LoadingComponent } from './components/loading/loading.component';
import { NgxSpinnerModule } from 'ngx-spinner';

/**
 * Shared Module
 * used to export components, services and models common in this application
 */
@NgModule({
  declarations: [
    SelectLangComponent,
    FooterComponent,
    FormFieldErrorComponent,
    LoadingComponent
  ],
  exports: [
    SelectLangComponent,
    FooterComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    NgxSpinnerModule
  ]
})
export class SharedModule { }
