import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home.component";
import { FullMapComponent } from './full-map/full-map.component';
import { AreaMapComponent } from './area-map/area-map.component';
import { MunicipalMapComponent } from './municipal-map/municipal-map.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    children: [
      {
        path: "",
        redirectTo: "area"
      },
      {
        path: "admin",
        component: FullMapComponent
      },
      {
        path: "municipal",
        component: MunicipalMapComponent
      },
      {
        path: "area",
        component: AreaMapComponent
      },
      {
        path: "search",
        component: SearchComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
