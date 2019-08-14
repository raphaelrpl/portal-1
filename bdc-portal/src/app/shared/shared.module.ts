import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatIconModule,
  MatSelectModule,
  MatRadioModule,
  MatInputModule,
  MatCheckboxModule
} from '@angular/material';

import { SelectLangComponent } from './components/select-lang/select-lang.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormFieldErrorComponent } from './components/form-field-input/form-field-error.component';
import { LoadingComponent } from './components/loading/loading.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DialogFeatureComponent } from './components/dialog-feature/dialog-feature.component';

/**
 * Shared Module
 * used to export components, services and models common in this application
 */
@NgModule({
  declarations: [
    SelectLangComponent,
    FooterComponent,
    FormFieldErrorComponent,
    LoadingComponent,
    DialogFeatureComponent
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
    FormsModule,
    MatRadioModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    NgxSpinnerModule
  ],
  entryComponents: [
    DialogFeatureComponent
  ]
})
export class SharedModule { }
