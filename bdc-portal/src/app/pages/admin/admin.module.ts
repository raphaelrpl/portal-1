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
  MatSortModule
} from '@angular/material';
import { AuthModule } from '../auth/auth.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LogsCubesComponent } from './cubes/logs-cubes/logs-cubes.component';
import { EditCubesComponent } from './cubes/edit-cubes/edit-cubes.component';
import { DescribeCubesComponent } from './cubes/describe-cubes/describe-cubes.component';
import { CreateCubeComponent } from './cubes/create-cube/create-cube.component';


@NgModule({
  declarations: [
    AdminComponent,
    ListCubesComponent,
    DescribeCubesComponent,
    EditCubesComponent,
    LogsCubesComponent,
    CreateCubeComponent,
    SidenavComponent,
    ToolbarComponent
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
    MatMenuModule
  ],
  entryComponents: [
    DescribeCubesComponent,
    LogsCubesComponent,
    EditCubesComponent
  ]
})
export class AdminModule { }
