import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiteManagementRoutingModule } from './site-management-routing.module';
import { SiteManagementComponent } from './site-management.component';
import { MatCardModule } from '@angular/material/card';
import { MunicipalityComponent, AddMunicipalityModalComponent, EditMunicipalityModalComponent } from './municipality/municipality.component';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SiteManagementComponent,
    MunicipalityComponent,
    AddMunicipalityModalComponent,
    EditMunicipalityModalComponent
  ],
  imports: [
    SiteManagementRoutingModule,
    CommonModule,
    SiteManagementRoutingModule,
    MatCardModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    FormsModule
  ],
  entryComponents: [
    AddMunicipalityModalComponent,
    EditMunicipalityModalComponent
  ]
})
export class SiteManagementModule { }
