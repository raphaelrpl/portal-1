import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SamplesService } from '../samples.service';
import { FileInputComponent } from 'ngx-material-file-input';
import { isObject } from 'util';


@Component({
  selector: 'app-upload-sample',
  templateUrl: './upload-sample.component.html',
  styleUrls: ['./upload-sample.component.scss']
})
export class UploadSampleComponent implements OnInit {
  formSampleUpload: FormGroup;
  @ViewChild(FileInputComponent, { static: false }) fileInput: FileInputComponent;
  systems: string[] = [
    'vmaus',
    'FAO'
  ]

  constructor(
    private fb: FormBuilder,
    private sampleService: SamplesService
  ) { }

  ngOnInit() {
    this.formSampleUpload = this.fb.group({
      classification_system: [null, Validators.required],
      file: [null, Validators.required],
      mappings: this.fb.group({
        // geom: null,
        class_name: [null, Validators.required],

        start_date: this.fb.group({
          key: [null, Validators.required],
          isColumn: true
        }),

        end_date: this.fb.group({
          key: [null, Validators.required],
          isColumn: true
        }),

        latitude: this.fb.group({
          key: null,
          isColumn: true
        }),

        longitude: this.fb.group({
          key: null,
          isColumn: true
        }),
      })
    });
  }

  onFileSelected(event: any) {

  }

  controls(key: string) {
    const group: FormGroup = <FormGroup>this.formSampleUpload.get(key);

    return Object.keys(group.controls);
  }

  async submit() {
    try {
      let mappings = this.formSampleUpload.get('mappings').value;
      console.log('Before', mappings)

      for(const pair of Object.entries(mappings)) {
        const [pairKey, pairValue] = pair;

        if (isObject(pairValue)) {
          if (!(<any>pairValue).key) {
            delete mappings[pairKey];
          }

          if (!(<any>pairValue).isColumn) {
            mappings[pairKey].value = pairValue['key'];
            delete mappings[pairKey].key;
          }
        }
      }
      console.log('after', mappings)

      const classification_system = this.formSampleUpload.get('classification_system').value;

      await this.sampleService.upload(mappings, classification_system, this.fileInput.value.files[0]);
    } catch (error) {
      alert(error.message)
      console.log(error)
    }
  }

}
