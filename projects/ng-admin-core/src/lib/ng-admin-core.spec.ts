import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgAdminCore } from './ng-admin-core';

describe('NgAdminCore', () => {
  let component: NgAdminCore;
  let fixture: ComponentFixture<NgAdminCore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgAdminCore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgAdminCore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
