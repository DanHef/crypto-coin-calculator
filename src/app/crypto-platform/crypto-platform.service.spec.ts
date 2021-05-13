import { TestBed } from '@angular/core/testing';

import { CryptoPlatformService } from './crypto-platform.service';

describe('CryptoPlatformService', () => {
  let service: CryptoPlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoPlatformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
