import { Component, OnInit } from '@angular/core';
import { ICryptoPortfolioItem } from './crypto-portfolio-item/crypto-portfolio-item';
import { CryptoPortfolioService } from './crypto-portfolio.service';

@Component({
    selector: 'crypto-portfolio',
    templateUrl: './crypto-portfolio.component.html',
    styleUrls: ['./crypto-portfolio.component.css']
})
export class CryptoPortfolioComponent implements OnInit {
    cryptoPortfolioItems: Array<ICryptoPortfolioItem>;

    constructor(private readonly cryptoPortfolioService: CryptoPortfolioService) { }

    ngOnInit(): void {
        this.cryptoPortfolioItems = this.cryptoPortfolioService.getPortfolioItems();

        console.log(JSON.stringify(this.cryptoPortfolioItems));
    }

    public onItemDeleted(itemId: number) {
        this.cryptoPortfolioItems = this.cryptoPortfolioService.deletePortfolioItem(itemId);

        console.log(`Crypto Portfolio Item deleted (ID: ${itemId})`);
    }

    public onItemQuantityChanged(itemChanged) {
        for (let i = 0; i < this.cryptoPortfolioItems.length; i++) {
            if (this.cryptoPortfolioItems[i].id === itemChanged.id) {
                this.cryptoPortfolioItems[i].quantity = itemChanged.quantity;
            }
        }
    }
}
