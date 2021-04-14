import { Injectable } from '@angular/core';
import { ICryptoPortfolioItem } from './crypto-portfolio-item/crypto-portfolio-item';
import { SecureStorage } from '@nativescript/secure-storage';
import { BehaviorSubject, combineLatest, from, merge, Subject } from 'rxjs';
import { filter, map, mergeMap, scan, shareReplay, take, tap } from 'rxjs/operators';

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
        tap((items) => console.log("StoredItems Reached with: " + items))
    );

    private itemDeletedSubject = new Subject<ItemCrudOperation>();
    public itemDeletedAction$ = this.itemDeletedSubject.asObservable();

    private itemAddedSubject = new Subject<ItemCrudOperation>();
    public itemAddedAction$ = this.itemAddedSubject.asObservable();

    private itemChangedSubject = new Subject<ItemCrudOperation>();
    public itemChangedAction$ = this.itemChangedSubject.asObservable();

    public items$ = merge(
        this.itemsFromStorage$,
        this.itemAddedAction$,
        this.itemDeletedAction$,
        this.itemChangedAction$.pipe(
            take(1)
        )
    ).pipe(
        scan((items: ICryptoPortfolioItem[], crudItem: ItemCrudOperation) => this.handleCRUDOperations(items, crudItem)),
        shareReplay(1),
        tap((items) => {
            console.log("Saving Items");
            this.storage.setSync({
                key: 'cryptoPortfolioItems',
                value: JSON.stringify({
                    "items": items
                })
            });
        })
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
        this.itemDeletedSubject.next({
            item,
            operation: 1
        });
    }

    addCryptoPortfolioItem(newItem: ICryptoPortfolioItem) {
        this.itemAddedSubject.next({
            item: newItem,
            operation: 2
        });
    }

    changeCryptoPortfolioItem(changedItem: ICryptoPortfolioItem) {
        this.itemChangedSubject.next({
            item: changedItem,
            operation: 3
        });
    }
}
