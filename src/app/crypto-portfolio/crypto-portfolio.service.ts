import { Injectable } from '@angular/core';
import { ICryptoPortfolioItem } from './crypto-portfolio-item/crypto-portfolio-item';
import { SecureStorage } from '@nativescript/secure-storage';
import { BehaviorSubject } from 'rxjs';
import { share } from 'rxjs/operators';
import { CRUDOperation } from '../shared/crud-operation.enum';
import { ICryptoPortfolioItemCRUD } from './crypto-portfolio-item/crypto-portfolio-item-crud';

const STORAGE_KEY_PORTFOLIO_ITEMS = 'cryptoPortfolioItems';

@Injectable({
    providedIn: 'root'
})
export class CryptoPortfolioService {
    private storage = new SecureStorage();

    constructor() { }

    private itemsFromStorageSubject = new BehaviorSubject<ICryptoPortfolioItem[]>(this.getStoredPortfolioItems());
    public items$ = this.itemsFromStorageSubject.asObservable().pipe(share());


    public deleteCryptoPortfolioItem(item: ICryptoPortfolioItem) {
        this.handleCRUDAndSave({ item, operation: CRUDOperation.Deleted });

        this.publishPortfolioItemsFromStorage();
    }

    public addCryptoPortfolioItem(item: ICryptoPortfolioItem) {
        this.handleCRUDAndSave({ item, operation: CRUDOperation.Added });

        this.publishPortfolioItemsFromStorage();
    }

    public changeCryptoPortfolioItem(item: ICryptoPortfolioItem) {
        this.handleCRUDAndSave({ item, operation: CRUDOperation.Changed });

        this.publishPortfolioItemsFromStorage();
    }


    private checkIfPortfolioItemExists(existingItems: ICryptoPortfolioItem[], checkItem: ICryptoPortfolioItem): boolean {
        //criteria for equal portfolio item: platform and currencyCode
        const existingIndex = existingItems.findIndex((existingPortfolioItem) => {
            return (existingPortfolioItem.platform === checkItem.platform
                && existingPortfolioItem.currencyCode === checkItem.currencyCode);
        });

        return existingIndex === - 1 ? false : true;
    }


    private publishPortfolioItemsFromStorage(): void {
        this.itemsFromStorageSubject.next(this.getStoredPortfolioItems());
    }

    private handleCRUDAndSave(crudItem: ICryptoPortfolioItemCRUD): ICryptoPortfolioItem[] {
        const storedItems = this.getStoredPortfolioItems();
        const crudResult = this.handleCRUDOperations(storedItems, crudItem);

        this.savePortfolioItems(crudResult);

        return crudResult;
    }

    private handleCRUDOperations(existingItems: ICryptoPortfolioItem[], crudPortfolioItem: ICryptoPortfolioItemCRUD): ICryptoPortfolioItem[] {
        let crudOperationResult = existingItems;
        switch (crudPortfolioItem.operation) {
            case CRUDOperation.Deleted:
                crudOperationResult = crudOperationResult.filter((checkPortfolioItem) => checkPortfolioItem.id !== crudPortfolioItem.item.id);
                break;

            case CRUDOperation.Added:
                if(!this.checkIfPortfolioItemExists(crudOperationResult, crudPortfolioItem.item)) {
                    crudOperationResult = [...crudOperationResult, crudPortfolioItem.item];
                }
                
                break;

            case CRUDOperation.Changed:
                crudOperationResult = crudOperationResult.map((portfolioItem) => {
                    if (portfolioItem.id === crudPortfolioItem.item.id) {
                        return crudPortfolioItem.item;
                    } else {
                        return portfolioItem;
                    }
                });
                break;

            default:
                break;
        }

        return crudOperationResult;
    }

    private savePortfolioItems(portfolioItems: ICryptoPortfolioItem[]): ICryptoPortfolioItem[] {
        const numberedItems = [...portfolioItems];

        for (let i = 0; i < numberedItems.length; i++) {
            numberedItems[i].id = i + 1;
        }

        this.storage.setSync({
            key: STORAGE_KEY_PORTFOLIO_ITEMS,
            value: JSON.stringify({
                "items": numberedItems
            })
        });

        return numberedItems;
    }


    private getStoredPortfolioItems() {
        let storedItems: ICryptoPortfolioItem[] = [];
        const storedItemsString = this.storage.getSync({ key: STORAGE_KEY_PORTFOLIO_ITEMS });
        if (storedItemsString) {
            storedItems = JSON.parse(storedItemsString).items as ICryptoPortfolioItem[];
        }

        return storedItems;
    }
}
