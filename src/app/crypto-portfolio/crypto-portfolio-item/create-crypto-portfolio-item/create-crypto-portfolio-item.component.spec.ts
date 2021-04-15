import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCryptoPortfolioItemComponent } from './create-crypto-portfolio-item.component';

describe('CreateCryptoPortfolioItemComponent', () => {
  let component: CreateCryptoPortfolioItemComponent;
  let fixture: ComponentFixture<CreateCryptoPortfolioItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCryptoPortfolioItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCryptoPortfolioItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
