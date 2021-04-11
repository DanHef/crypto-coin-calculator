import { TestBed } from '@angular/core/testing';

import { CryptoPortfolioService } from './crypto-portfolio.service';

describe('CryptoPortfolioService', () => {
  let service: CryptoPortfolioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoPortfolioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
