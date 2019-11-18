import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SamplesService } from '../samples.service';
import { FileInputComponent } from 'ngx-material-file-input';
import { isObject } from 'util';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/pages/auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { showLoading, closeLoading } from 'src/app/app.action';

@Component({
  selector: 'app-upload-sample',
  templateUrl: './upload-sample.component.html',
  styleUrls: ['./upload-sample.component.scss']
})
export class UploadSampleComponent implements OnInit {
  formSampleUpload: FormGroup;

  @ViewChild(FileInputComponent, { static: false }) fileInput: FileInputComponent;

  systems: string[] = [];

  token: string;

  constructor(
    private fb: FormBuilder,
    private sampleService: SamplesService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private store: Store<AppState>,
  ) { }

  /**
   * Check user authorization.
   * @todo Creates a wrapper components that acts for general user permission. HoC.
   */
  public async getAuthorizeToken() {
    this.store.dispatch(showLoading());
    try {
      const response = await this.authService.token(`samples:manage:post`, 'samples');
      if (response) {
        this.token = response.access_token;
      }
    } finally {
      this.store.dispatch(closeLoading());
    }
  }

  ngOnInit() {
    this.getAuthorizeToken()
      .then(() => this.sampleService.getClassificationSystems(this.token))
      .then(systems => {
        this.systems = systems.map((system: any) => system.authority_name);
      })

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

  /**
   * Prepare the input data set mappings to the sampledb format
   *
   * @returns {any} sampledb mappings
   */
  private prepareMappings() {
    let mappings = this.formSampleUpload.get('mappings').value;

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

    return mappings;
  }

  /** Submit the process to the backend */
  async submit() {
    this.store.dispatch(showLoading())
    try {
      let mappings = this.prepareMappings();

      if (this.formSampleUpload.status === 'VALID') {
        const classification_system = this.formSampleUpload.get('classification_system').value;

        const response: any = await this.sampleService.upload(mappings, classification_system, this.fileInput.value.files[0], this.token);

        this.snackBar.open(`${response.affected} samples uploaded.`, '', {
          duration: 4000,
          verticalPosition: 'top',
          panelClass: 'app_snack-bar-success'
        });
      }

    } catch (error) {
      this.snackBar.open(`Error creating classification system - ${error.message}!`, '', {
        duration: 4000,
        verticalPosition: 'top',
        panelClass: 'app_snack-bar-error'
      });
    } finally {
      this.store.dispatch(closeLoading())
    }
  }
}