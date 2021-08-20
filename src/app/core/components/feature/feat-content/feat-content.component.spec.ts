import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatContentComponent } from './feat-content.component';

describe('FeatContentComponent', () => {
  let component: FeatContentComponent;
  let fixture: ComponentFixture<FeatContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeatContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
