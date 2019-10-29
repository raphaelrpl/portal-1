import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ListCubesComponent } from './cubes/list-cubes/list-cubes.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatExpansionModule,
  MatRadioModule,
  MatInputModule,
  MatBottomSheetModule,
  MatMenuModule,
  MatSidenavModule,
  MatTableModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatSelectModule,
  MatCheckboxModule,
  MatPaginatorModule,
  MatSortModule,
  MatTooltipModule
} from '@angular/material';
import { MaterialFileInputModule } from 'ngx-material-file-input';

import { AuthModule } from '../auth/auth.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LogsCubesComponent } from './cubes/logs-cubes/logs-cubes.component';
import { EditCubesComponent } from './cubes/edit-cubes/edit-cubes.component';
import { DescribeCubesComponent } from './cubes/describe-cubes/describe-cubes.component';
import { CreateCubeComponent } from './cubes/create-cube/create-cube.component';
import { UploadSampleComponent } from './samples/upload-sample/upload-sample.component';
import { CreateClassificationSystemComponent } from './samples/create-classification-system/create-classification-system.component';


@NgModule({
  declarations: [
    AdminComponent,
    ListCubesComponent,
    DescribeCubesComponent,
    EditCubesComponent,
    LogsCubesComponent,
    CreateCubeComponent,
    SidenavComponent,
    ToolbarComponent,
    UploadSampleComponent,
    CreateClassificationSystemComponent
  ],
  imports: [
    AuthModule,
    CommonModule,
    SharedModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    AdminRoutingModule,
    MatSelectModule,
    MatExpansionModule,
    MatRadioModule,
    MatBottomSheetModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatMenuModule,
    MatTooltipModule,
    MaterialFileInputModule
  ],
  entryComponents: [
    DescribeCubesComponent,
    LogsCubesComponent,
    EditCubesComponent
  ]
})
export class AdminModule { }
