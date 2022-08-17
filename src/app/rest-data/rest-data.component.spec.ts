import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsetDataComponent } from './rset-data.component';

describe('RsetDataComponent', () => {
  let component: RsetDataComponent;
  let fixture: ComponentFixture<RsetDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsetDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RsetDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
