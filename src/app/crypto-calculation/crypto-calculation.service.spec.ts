import { TestBed } from '@angular/core/testing';

import { CryptoCalculationService } from './crypto-calculation.service';

describe('CryptoCalculationService', () => {
  let service: CryptoCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoCalculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
