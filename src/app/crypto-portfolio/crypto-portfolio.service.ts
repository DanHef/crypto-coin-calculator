import { Injectable } from '@angular/core';
import { ICryptoPortfolioItem } from './crypto-portfolio-item/crypto-portfolio-item';
import { SecureStorage } from '@nativescript/secure-storage';
import { BehaviorSubject } from 'rxjs';
import { share } from 'rxjs/operators';

interface ItemCrudOperation {
    item: ICryptoPortfolioItem;
    operation: number;
}

enum ChangeOperation {
    Deleted = 1,
    Added = 2,
    Changed = 3,
}

const STORAGE_KEY_PORTFOLIO_ITEMS = 'cryptoPortfolioItems';

const STANDARD_TARGET_CURRENCY = 'eur';

@Injectable({
    providedIn: 'root'
})
export class CryptoPortfolioService {
    private storage = new SecureStorage();

    constructor() { }

    private itemsFromStorageSubject = new BehaviorSubject<ICryptoPortfolioItem[]>(this.getStoredItems());
    public items$ = this.itemsFromStorageSubject.asObservable().pipe(
        share()
    );

    public savePortfolioItems(portfolioItems: ICryptoPortfolioItem[]): ICryptoPortfolioItem[] {
        const numberedItems = [...portfolioItems];

        for(let i=0; i<numberedItems.length; i++) {
            numberedItems[i].id = i + 1;
        }

        const successful = this.storage.setSync({
            key: STORAGE_KEY_PORTFOLIO_ITEMS,
            value: JSON.stringify({
                "items": numberedItems
            })
        });

        console.log("Save Successful: " + successful);

        return numberedItems;
    }



    public deleteCryptoPortfolioItem(item: ICryptoPortfolioItem) {
        const items = this.handleCRUDOperations({ item, operation: ChangeOperation.Deleted });

        this.itemsFromStorageSubject.next(items);
    }

    public addCryptoPortfolioItem(item: ICryptoPortfolioItem) {
        const items = this.handleCRUDOperations({ item, operation: ChangeOperation.Added });

        console.log("New Items: " + JSON.stringify(items));
        this.itemsFromStorageSubject.next(items);
    }

    public changeCryptoPortfolioItem(item: ICryptoPortfolioItem) {
        const items = this.handleCRUDOperations({ item, operation: ChangeOperation.Changed });

        this.itemsFromStorageSubject.next(items);
    }

    private handleCRUDOperations(crudItem: ItemCrudOperation) {
        let items = this.getStoredItems();
        if (crudItem.operation === ChangeOperation.Deleted) {
            items =  items.filter((checkItem) => checkItem.id !== crudItem.item.id);
        } else if (crudItem.operation === ChangeOperation.Added) {
            items = [...items, crudItem.item];
        } else if (crudItem.operation === ChangeOperation.Changed) {
            items = items.map((item) => {
                if (item.id === crudItem.item.id) {
                    return crudItem.item;
                } else {
                    return item;
                }
            });
        }

        items = this.savePortfolioItems(items);

        return items;
    }

    private getStoredItems() {
        let storedItems: ICryptoPortfolioItem[] = [];
        const storedItemsString = this.storage.getSync({ key: STORAGE_KEY_PORTFOLIO_ITEMS });
        if (storedItemsString) {
            storedItems = JSON.parse(storedItemsString).items as ICryptoPortfolioItem[];
        }

        return storedItems;
    }
}
