import { NgModule } from '@angular/core';

/* Module for writing all the shared items like components, pipes, directives */

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class SharedModule {

  static forRoot() {
    return {
      ngModule: SharedModule,
      providers: [/* Names of all services created in the shared module */]
    }
  }

}
