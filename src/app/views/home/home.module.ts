import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgmCoreModule } from "@agm/core";
import { AgmDirectionModule } from 'agm-direction';

import { HomeComponent } from "./home.component";
import { HeaderComponent } from "../common/components/header/header.component";
import { SideNavComponent } from "../common/components/side-nav/side-nav.component";
import { FooterComponent } from "../common/components/footer/footer.component";
import { ContentComponent } from "../common/components/content/content.component";
import { MapComponent } from "../common/components/map/map.component";
import { HomeRoutingModule } from "./home-routing.module";
import { FullMapComponent } from './full-map/full-map.component';
import { AreaMapComponent } from './area-map/area-map.component';
import { MatSelectModule } from '@angular/material/select';
import { MunicipalMapComponent } from './municipal-map/municipal-map.component';
import { SearchComponent } from './search/search.component';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { CollectionHistoryModalComponent } from './collection-history-modal/collection-history-modal.component';
import { StaffDetailModalComponent } from './staff-detail-modal/staff-detail-modal.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    HeaderComponent,
    SideNavComponent,
    FooterComponent,
    ContentComponent,
    HomeComponent,
    MapComponent,
    FullMapComponent,
    AreaMapComponent,
    MunicipalMapComponent,
    SearchComponent,
    CollectionHistoryModalComponent,
    StaffDetailModalComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    AgmCoreModule.forRoot({
      //  apiKey: "xyz"
    }),
    AgmDirectionModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTabsModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule
  ],
  entryComponents: [
    CollectionHistoryModalComponent,
    StaffDetailModalComponent
  ]
})
export class HomeModule { }
