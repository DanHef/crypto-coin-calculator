import { Injectable } from '@angular/core';
import { ICryptoPortfolioItem } from './crypto-portfolio-item/crypto-portfolio-item';
import { SecureStorage } from '@nativescript/secure-storage';
import { from, merge, Subject } from 'rxjs';
import { map, scan, shareReplay, tap } from 'rxjs/operators';

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

@Injectable({
    providedIn: 'root'
})
export class CryptoPortfolioService {
    private storage = new SecureStorage();

    public itemsFromStorage$ = from(this.storage.get({ key: STORAGE_KEY_PORTFOLIO_ITEMS })).pipe(
        map(storedItemString => JSON.parse(storedItemString)),
        map(storedItemsJSON => storedItemsJSON && storedItemsJSON.items ? storedItemsJSON.items as ICryptoPortfolioItem[] : []),
        shareReplay(1),
        tap((items) => console.log("StoredItems Array: " + JSON.stringify(items)))
    );

    private itemCrudSubject = new Subject<ItemCrudOperation>();
    public itemCrudAction$ = this.itemCrudSubject.asObservable();

    public items$ = merge(
        this.itemsFromStorage$,
        this.itemCrudAction$
    ).pipe(
        scan((items: ICryptoPortfolioItem[], crudItem: ItemCrudOperation) => this.handleCRUDOperations(items, crudItem)),
        shareReplay(1),
        map(cryptoPortfolioItems => {
            if (cryptoPortfolioItems) {
                for (let i = 0; i < cryptoPortfolioItems.length; i++) {
                    cryptoPortfolioItems[i].id = i + 1;
                }
            }

            return cryptoPortfolioItems;
        }),
        tap((cryptoPortfolioItems) => {
            console.log("Saving Items: " + JSON.stringify(cryptoPortfolioItems));
            this.storage.set({
                key: STORAGE_KEY_PORTFOLIO_ITEMS,
                value: JSON.stringify({
                    "items": cryptoPortfolioItems
                })
            });
        }),
        tap((items) => console.log("Emitted Items: " + JSON.stringify(items)))
    )

    constructor() { }

    public deleteCryptoPortfolioItem(item: ICryptoPortfolioItem) {
        this.itemCrudSubject.next({
            item,
            operation: ChangeOperation.Deleted
        });
    }

    public addCryptoPortfolioItem(item: ICryptoPortfolioItem) {
        this.itemCrudSubject.next({
            item,
            operation: ChangeOperation.Added
        } as ItemCrudOperation);
    }

    public changeCryptoPortfolioItem(item: ICryptoPortfolioItem) {
        this.itemCrudSubject.next({
            item,
            operation: ChangeOperation.Changed
        });
    }

    private handleCRUDOperations(items: ICryptoPortfolioItem[], crudItem: ItemCrudOperation) {
        if (crudItem.operation === ChangeOperation.Deleted) {
            return items.filter((checkItem) => checkItem.id !== crudItem.item.id);
        } else if (crudItem.operation === ChangeOperation.Added) {
            return [...items, crudItem.item];
        } else if (crudItem.operation === ChangeOperation.Changed) {
            return items.map((item) => {
                if (item.id === crudItem.item.id) {
                    return crudItem.item;
                } else {
                    return item;
                }
            });
        }
    }
}
