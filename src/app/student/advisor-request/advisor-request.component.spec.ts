import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisorRequestComponent } from './advisor-request.component';

describe('AdvisorRequestComponent', () => {
  let component: AdvisorRequestComponent;
  let fixture: ComponentFixture<AdvisorRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvisorRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisorRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
