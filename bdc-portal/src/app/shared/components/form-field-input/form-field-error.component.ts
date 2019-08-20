import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

/**
 * Field Errors
 * component to display errors and valid fileds in forms
 */
@Component({
  selector: 'form-field-error',
  templateUrl: './form-field-error.component.html',
  styleUrls: ['./form-field-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldErrorComponent implements OnInit {

  @Input() errorPrefix: string;
  @Input() errors: ValidationErrors;
  
  constructor() {}

  ngOnInit() {}
}
