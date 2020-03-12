import { NgModule, Optional, SkipSelf } from '@angular/core';
import { DataService } from './services/data.service';
import { HttpService } from './services/http.service';

/* Module for writing all the global services */

@NgModule({
  providers: [ 
    DataService, 
    HttpService
  ]
})
export class CoreModule { 

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }

}
