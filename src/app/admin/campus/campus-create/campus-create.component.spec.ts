import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusCreateComponent } from './campus-create.component';

describe('CampusCreateComponent', () => {
  let component: CampusCreateComponent;
  let fixture: ComponentFixture<CampusCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampusCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampusCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
