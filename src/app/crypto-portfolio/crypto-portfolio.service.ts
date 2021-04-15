import { Injectable } from '@angular/core';
import { ICryptoPortfolioItem } from './crypto-portfolio-item/crypto-portfolio-item';
import { SecureStorage } from '@nativescript/secure-storage';
import { from, merge, Subject } from 'rxjs';
import { map, scan, shareReplay, tap } from 'rxjs/operators';

interface ItemCrudOperation {
    item: ICryptoPortfolioItem;
    operation: number;
}

@Injectable({
    providedIn: 'root'
})
export class CryptoPortfolioService {
    private storage = new SecureStorage();

    public itemsFromStorage$ = from(this.storage.get({ key: 'cryptoPortfolioItems' })).pipe(
        map(storedItemString => JSON.parse(storedItemString)),
        map(storedItemsJSON => storedItemsJSON.items as ICryptoPortfolioItem[]),
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
        tap((items) => {
            console.log("Saving Items: " + JSON.stringify(items));
            this.storage.set({
                key: 'cryptoPortfolioItems',
                value: JSON.stringify({
                    "items": items
                })
            });
        }),
        tap((items) => console.log("Emitted Items: " + JSON.stringify(items)))
    )

    constructor() { }

    private handleCRUDOperations(items: ICryptoPortfolioItem[], crudItem: ItemCrudOperation) {
        if (crudItem.operation === 1) {
            //deleted
            return items.filter((checkItem) => checkItem.id !== crudItem.item.id);
        } else if (crudItem.operation === 2) {
            //added
            return [...items, crudItem.item];
        } else if (crudItem.operation === 3) {
            //changed
            return items.map((item) => {
                if(item.id === crudItem.item.id) {
                    return crudItem.item;
                } else {
                    return item;
                }
            });
        }
    }

    deleteCryptoPortfolioItem(item: ICryptoPortfolioItem) {
        this.itemCrudSubject.next({
            item,
            operation: 1
        });
    }

    addCryptoPortfolioItem(newItem: ICryptoPortfolioItem) {
        this.itemCrudSubject.next({
            item: newItem,
            operation: 2
        } as ItemCrudOperation);
    }

    changeCryptoPortfolioItem(changedItem: ICryptoPortfolioItem) {
        this.itemCrudSubject.next({
            item: changedItem,
            operation: 3
        });
    }
}
