import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizationTermAppraisalComponent } from './realization-term-appraisal.component';

describe('RealizationTermAppraisalComponent', () => {
  let component: RealizationTermAppraisalComponent;
  let fixture: ComponentFixture<RealizationTermAppraisalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealizationTermAppraisalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RealizationTermAppraisalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
