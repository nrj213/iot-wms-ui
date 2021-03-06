import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SiteManagementComponent } from './site-management.component';
import { MunicipalityComponent } from './municipality/municipality.component';
import { AreaComponent } from './area/area.component';
import { StaffComponent } from './staff/staff.component';
import { BinComponent } from './bin/bin.component';


const routes: Routes = [
  {
    path: "",
    component: SiteManagementComponent,
  },
  {
    path: "municipality",
    component: MunicipalityComponent
  },
  {
    path: "area",
    component: AreaComponent
  },
  {
    path: "staff",
    component: StaffComponent
  },
  {
    path: "bin",
    component: BinComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteManagementRoutingModule { }
