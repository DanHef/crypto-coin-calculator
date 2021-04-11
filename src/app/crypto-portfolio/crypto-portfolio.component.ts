import { Component, OnInit } from '@angular/core';
import { ICryptoPortfolioItem } from './crypto-portfolio-item';

@Component({
    selector: 'crypto-portfolio',
    templateUrl: './crypto-portfolio.component.html',
    styleUrls: ['./crypto-portfolio.component.css']
})
export class CryptoPortfolioComponent implements OnInit {
    cryptoPortfolioItems: Array<ICryptoPortfolioItem> = [{
        id: 1,
        name: "",
        description: "Description1",
        quantity: 1,
        platform: "",
        symbol: "",
        sortOrderNumber: 0
    },{
        id: 2,
        name: "",
        description: "Description2",
        quantity: 2,
        platform: "",
        symbol: "",
        sortOrderNumber: 0
    }];

    constructor() { }

    ngOnInit(): void {
    }

    public onItemDeleted(itemId: number) {
        console.log(`Crypto Portfolio Item deleted (ID: ${itemId})`);
        this.cryptoPortfolioItems.splice(this.cryptoPortfolioItems.findIndex((item) => {
            return item.id === itemId;
        }),1);
    }

    public onItemQuantityChanged(itemChanged) {
        console.log(itemChanged);
        for(let i=0; i<this.cryptoPortfolioItems.length; i++) {
            if(this.cryptoPortfolioItems[i].id === itemChanged.id) {
                this.cryptoPortfolioItems[i].quantity = itemChanged.quantity;
            }
        }

        console.log(`Result: ${JSON.stringify(this.cryptoPortfolioItems)}`);
    }

}
