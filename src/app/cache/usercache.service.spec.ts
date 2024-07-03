import { TestBed } from '@angular/core/testing';

import { UsercacheService } from './usercache.service';

describe('UsercacheService', () => {
  let service: UsercacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsercacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
