import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ICryptoPortfolioItem } from './crypto-portfolio-item/crypto-portfolio-item';
import { CryptoPortfolioService } from './crypto-portfolio.service';
import { ICryptoPortfolioItemChanged } from './crypto-portfolio-item/crypto-portfolio-item-changed';

@Component({
    selector: 'crypto-portfolio',
    templateUrl: './crypto-portfolio.component.html',
    styleUrls: ['./crypto-portfolio.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CryptoPortfolioComponent implements OnInit {
    cryptoPortfolioItems$ = this.cryptoPortfolioService.items$;

    constructor(private readonly cryptoPortfolioService: CryptoPortfolioService) { }

    ngOnInit(): void {
        /*this.cryptoPortfolioItems = this.cryptoPortfolioService.getPortfolioItems();

        console.log(JSON.stringify(this.cryptoPortfolioItems));*/
    }

    public onItemDeleted(item: ICryptoPortfolioItem) {
        this.cryptoPortfolioService.deleteCryptoPortfolioItem(item);
        //this.cryptoPortfolioItems = this.cryptoPortfolioService.deletePortfolioItem(itemId);

        //console.log(`Crypto Portfolio Item deleted (ID: ${itemId})`);
    }

    public onItemChanged(itemChange: ICryptoPortfolioItemChanged) {
        this.cryptoPortfolioService.changeCryptoPortfolioItem({ ...itemChange.item, quantity: itemChange.quantity });
    }

    public onItemAdded(item: ICryptoPortfolioItem) {
        item = {
            id: 3,
            description: "New Item",
            name: "New Name",
            platform: "Bitstamp",
            quantity: 1,
            sortOrderNumber: 3,
            symbol: "BTS"
        } as ICryptoPortfolioItem;
        this.cryptoPortfolioService.addCryptoPortfolioItem(item);
    }
}
