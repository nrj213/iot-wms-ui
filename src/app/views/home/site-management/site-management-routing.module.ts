import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SiteManagementComponent } from './site-management.component';
import { MunicipalityComponent } from './municipality/municipality.component';


const routes: Routes = [
  {
    path: "",
    component: SiteManagementComponent,
  },
  {
    path: "municipality",
    component: MunicipalityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteManagementRoutingModule { }
