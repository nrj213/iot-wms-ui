import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MunicipalMapComponent } from './municipal-map.component';

describe('MunicipalMapComponent', () => {
  let component: MunicipalMapComponent;
  let fixture: ComponentFixture<MunicipalMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MunicipalMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MunicipalMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
