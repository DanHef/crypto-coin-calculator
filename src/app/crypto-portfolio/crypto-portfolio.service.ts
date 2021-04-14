import { Injectable } from '@angular/core';
import { ICryptoPortfolioItem } from './crypto-portfolio-item/crypto-portfolio-item';
import { SecureStorage } from '@nativescript/secure-storage';

@Injectable({
    providedIn: 'root'
})
export class CryptoPortfolioService {
    private items: ICryptoPortfolioItem[] = [];

    private storage = new SecureStorage();

    constructor() { }

    getPortfolioItems(): ICryptoPortfolioItem[] {
        this.storage.removeSync({
            key: 'cryptoPortfolioItems'
        });

        this.storage.setSync({
            key: 'cryptoPortfolioItems',
            value: JSON.stringify({
                items: [{
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
            }]})
        });

        const storedItemsString = this.storage.getSync({
            key: 'cryptoPortfolioItems'
        });

        return JSON.parse(storedItemsString).items;
    }

    deletePortfolioItem(itemId: number): ICryptoPortfolioItem[] {
        return this.items.splice(this.items.findIndex((item) => {
            return item.id === itemId;
        }), 1);
    }
}
