import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SamplesService } from '../samples.service';

@Component({
  selector: 'app-create-classification-system',
  templateUrl: './create-classification-system.component.html',
  styleUrls: ['./create-classification-system.component.scss']
})
export class CreateClassificationSystemComponent implements OnInit {
  formClassSystem: FormGroup

  constructor(
    private fb: FormBuilder,
    private sampleService: SamplesService
  ) { }

  ngOnInit() {
    this.formClassSystem = this.fb.group({
      authority_name: [null, Validators.required],
      system_name: [null, Validators.required],
      description: [null, Validators.required],
    })
  }

  async submit() {
    if (!this.formClassSystem.valid) {
      const data = this.formClassSystem.value;

      await this.sampleService.addClassificationSystem(data);
    }
  }

}
