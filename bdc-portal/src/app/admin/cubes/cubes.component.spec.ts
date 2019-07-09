import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CubesComponent } from './cubes.component';

describe('CubesComponent', () => {
  let component: CubesComponent;
  let fixture: ComponentFixture<CubesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CubesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CubesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
