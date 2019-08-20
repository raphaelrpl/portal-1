import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * Field Errors
 * component to display errors and valid fileds in forms
 */
@Component({
  selector: 'app-form-field-error',
  templateUrl: './form-field-error.component.html',
  styleUrls: ['./form-field-error.component.scss']
})
export class FormFieldErrorComponent {

  /** reference of the form */
  // tslint:disable-next-line:no-input-rename
  @Input('form-control') formControl: FormControl;

  /** return errors by form or null if not exits errors */
  public get errorMessage(): string | null {
    if (this.formControl.invalid && this.formControl.touched) {
      if (this.formControl.errors.required) {
        return 'dado obrigatório';
      } else if (this.formControl.errors.email) {
        return 'formato de email inválido';
      } else if (this.formControl.errors.minlength) {
        const requiredLength = this.formControl.errors.minlength.requiredLength;
        return `deve ter no mínimo ${requiredLength} caracteres`;
      } else if (this.formControl.errors.maxlength) {
        const requiredLength = this.formControl.errors.maxlength.requiredLength;
        return `deve ter no máximo ${requiredLength} caracteres`;
      }

    } else {
      return null;
    }
  }
}
