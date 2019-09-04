import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ListCubesComponent } from './list-cubes/list-cubes.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule, MatToolbarModule, MatIconModule, MatExpansionModule, MatRadioModule, MatInputModule, MatBottomSheetModule, MatMenuModule, MatSidenavModule, MatTableModule } from '@angular/material';
import { AuthModule } from '../auth/auth.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { DescribeCubesComponent } from './describe-cubes/describe-cubes.component';


@NgModule({
  declarations: [
    AdminComponent,
    ListCubesComponent,
    DescribeCubesComponent,
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
    MatExpansionModule,
    MatRadioModule,
    MatBottomSheetModule,
    MatInputModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatMenuModule
  ],
  entryComponents: [
    DescribeCubesComponent
  ]
})
export class AdminModule { }
