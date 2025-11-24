import { TestBed } from '@angular/core/testing';

import { OauthStore } from './oauth-store';

describe('OauthStore', () => {
  let service: OauthStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OauthStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
