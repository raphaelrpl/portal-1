import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { SamplesService } from '../samples.service';
import { showLoading, closeLoading } from 'src/app/app.action';
import { AuthService } from 'src/app/pages/auth/auth.service';

@Component({
  selector: 'app-create-classification-system',
  templateUrl: './create-classification-system.component.html',
  styleUrls: ['./create-classification-system.component.scss']
})
export class CreateClassificationSystemComponent implements OnInit {
  formClassSystem: FormGroup

  token: string;

  constructor(
    private fb: FormBuilder,
    private sampleService: SamplesService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.formClassSystem = this.fb.group({
      authority_name: [null, Validators.required],
      system_name: [null, Validators.required],
      description: [null, Validators.required],
    });

    this.getAuthorizeToken();
  }

  async submit() {
    this.store.dispatch(showLoading());

    if (this.formClassSystem.valid) {
      const data = this.formClassSystem.value;

      try {
        await this.sampleService.addClassificationSystem(data, this.token);

        this.snackBar.open(`Created ${data.authority_name}`, '', {
          duration: 4000,
          verticalPosition: 'top',
          panelClass: 'app_snack-bar-success'
        });
      } catch (error) {
        this.snackBar.open(`Error creating classification system - ${error}!`, '', {
          duration: 4000,
          verticalPosition: 'top',
          panelClass: 'app_snack-bar-error'
        });
      } finally {
        this.store.dispatch(closeLoading());
      }
    }
  }

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

}
