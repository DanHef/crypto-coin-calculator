import { Injectable } from '@angular/core';
import { ICryptoPortfolioItem } from './crypto-portfolio-item';

@Injectable({
    providedIn: 'root'
})
export class CryptoPortfolioService {
    private items: ICryptoPortfolioItem[] = [{
        id: 1,
        name: "",
        description: "Description1",
        quantity: 1,
        platform: "",
        symbol: "",
        sortOrderNumber: 0
    }, {
        id: 2,
        name: "",
        description: "Description2",
        quantity: 2,
        platform: "",
        symbol: "",
        sortOrderNumber: 0
    }];

    constructor() { }

    getPortfolioItems(): ICryptoPortfolioItem[] {
        return this.items;
    }

    deletePortfolioItem(itemId: number): ICryptoPortfolioItem[] {
        return this.items.splice(this.items.findIndex((item) => {
            return item.id === itemId;
        }), 1);
    }
}
