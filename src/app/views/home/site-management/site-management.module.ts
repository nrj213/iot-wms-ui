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
import { AreaComponent, AddAreaModalComponent, EditAreaModalComponent } from './area/area.component';
import { MatSelectModule } from '@angular/material/select';
import { StaffComponent, AddStaffModalComponent, EditStaffModalComponent } from './staff/staff.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [
    SiteManagementComponent,
    MunicipalityComponent,
    AddMunicipalityModalComponent,
    EditMunicipalityModalComponent,
    AreaComponent,
    AddAreaModalComponent,
    EditAreaModalComponent,
    StaffComponent,
    AddStaffModalComponent,
    EditStaffModalComponent
  ],
  imports: [
    SiteManagementRoutingModule,
    CommonModule,
    SiteManagementRoutingModule,
    MatCardModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  entryComponents: [
    AddMunicipalityModalComponent,
    EditMunicipalityModalComponent,
    AddAreaModalComponent,
    EditAreaModalComponent,
    AddStaffModalComponent,
    EditStaffModalComponent
  ]
})
export class SiteManagementModule { }
