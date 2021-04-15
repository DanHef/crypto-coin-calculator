import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ICryptoPortfolioItem } from './crypto-portfolio-item/crypto-portfolio-item';
import { CryptoPortfolioService } from './crypto-portfolio.service';
import { ICryptoPortfolioItemChanged } from './crypto-portfolio-item/crypto-portfolio-item-changed';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'crypto-portfolio',
    templateUrl: './crypto-portfolio.component.html',
    styleUrls: ['./crypto-portfolio.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CryptoPortfolioComponent {
    cryptoPortfolioItems$ = this.cryptoPortfolioService.items$;

    constructor(private readonly cryptoPortfolioService: CryptoPortfolioService) { }

    public onItemDeleted(item: ICryptoPortfolioItem) {
        this.cryptoPortfolioService.deleteCryptoPortfolioItem(item);
    }

    public onItemChanged(itemChange: ICryptoPortfolioItemChanged) {
        this.cryptoPortfolioService.changeCryptoPortfolioItem({ ...itemChange.item, quantity: itemChange.quantity });
    }
}
