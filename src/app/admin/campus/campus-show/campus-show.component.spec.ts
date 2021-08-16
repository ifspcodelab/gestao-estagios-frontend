import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusShowComponent } from './campus-show.component';

describe('CampusShowComponent', () => {
  let component: CampusShowComponent;
  let fixture: ComponentFixture<CampusShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampusShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampusShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
