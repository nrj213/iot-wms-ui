import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgmCoreModule } from "@agm/core";

import { HomeComponent } from "./home.component";
import { HeaderComponent } from "../common/header/header.component";
import { SideNavComponent } from "../common/side-nav/side-nav.component";
import { FooterComponent } from "../common/footer/footer.component";
import { ContentComponent } from "../common/content/content.component";
import { MapComponent } from "../map/map.component";
import { HomeRoutingModule } from "./home-routing.module";

@NgModule({
  declarations: [
    HeaderComponent,
    SideNavComponent,
    FooterComponent,
    ContentComponent,
    HomeComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    AgmCoreModule.forRoot({
      // apiKey: "xyz"
    })
  ]
})
export class HomeModule {}
