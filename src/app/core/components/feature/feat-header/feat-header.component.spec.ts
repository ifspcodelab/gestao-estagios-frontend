import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatHeaderComponent } from './feat-header.component';

describe('FeatHeaderComponent', () => {
  let component: FeatHeaderComponent;
  let fixture: ComponentFixture<FeatHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeatHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
