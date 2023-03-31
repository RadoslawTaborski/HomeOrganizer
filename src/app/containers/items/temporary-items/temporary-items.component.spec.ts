import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TemporaryItemsComponent } from './temporary-items.component';

describe('TemporaryItemsComponent', () => {
  let component: TemporaryItemsComponent;
  let fixture: ComponentFixture<TemporaryItemsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TemporaryItemsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemporaryItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
