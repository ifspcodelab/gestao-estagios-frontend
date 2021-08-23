import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentToolbarComponent } from './content-toolbar.component';

describe('ContentToolbarComponent', () => {
  let component: ContentToolbarComponent;
  let fixture: ComponentFixture<ContentToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
