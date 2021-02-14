import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";

import { CoinPortfolioItem } from "../CoinPortfolioItem";
import { SecureStorage } from "nativescript-secure-storage";

@Injectable()
export class PortfolioItemService {
    portfolioItems: Array<CoinPortfolioItem> = [];
    private secureStorage: SecureStorage = new SecureStorage();

    constructor() { }

    addPortfolioItem(portfolioItem) {
        portfolioItem.setSortOrderNumber(this.portfolioItems.length);
        this.portfolioItems.push(portfolioItem);
    }


    createPortfolioItem(technicalName: string, description: string,
        quantity: number, platform: string, symbol: string): CoinPortfolioItem {
        if (!technicalName || !description || !platform) {
            return null;
        }
        let portfolioItem = new CoinPortfolioItem(platform, technicalName, description, symbol, quantity);

        this.portfolioItems.push(portfolioItem);

        return portfolioItem;
    }

    deletePortfolioItem(portfolioItem: CoinPortfolioItem) {
        for (var i = 0; i < this.portfolioItems.length; i++) {
            let currentPortfolioItem = this.portfolioItems[i];
            if (currentPortfolioItem.getPortfolioName() === portfolioItem.getPortfolioName() &&
                currentPortfolioItem.getPortfolioItemName() === portfolioItem.getPortfolioItemName() &&
                currentPortfolioItem.getSymbol() === portfolioItem.getSymbol()) {
                this.portfolioItems.splice(i, 1);
            }
        }
    }


    getPortfolioItemByTechnicalName(technicalName: string, platform: string): CoinPortfolioItem {
        for (var i = 0; i < this.portfolioItems.length; i++) {
            if (this.portfolioItems[i].getPortfolioItemName() === technicalName) {
                return this.portfolioItems[i];
            }
        }

        return null;
    }

    getAllPortfolioItems(): Array<CoinPortfolioItem> {
        return this.portfolioItems;
    }


    savePortfolio() {
        this.secureStorage.setSync({
            key: "cryptoCoinCalcPortfolio",
            value: JSON.stringify(this.portfolioItems)
        });
    }


    loadPortfolio() {
        //this.secureStorage.removeSync({key: "cryptoCoinCalcPortfolio"});

        let storedPortfolioString = this.secureStorage.getSync({
            key: "cryptoCoinCalcPortfolio",
        });

        if (storedPortfolioString) {
            let storedPortfolio = JSON.parse(storedPortfolioString);
            for (var i = 0; i < storedPortfolio.length; i++) {
                let storedPortfolioItem = storedPortfolio[i];
                let portfolioItem = this.createPortfolioItem(storedPortfolioItem.portfolioItemName,
                    storedPortfolioItem.portfolioItemDescription,
                    storedPortfolioItem.quantity,
                    storedPortfolioItem.platform,
                    storedPortfolioItem.symbol);

                if (!portfolioItem) {
                    console.log("PortfolioItem " + storedPortfolioItem.portfolioItemName + " not created");
                }
            }
        }

        console.log("Sorting");

        this.portfolioItems.sort((a, b) => {
            return a.getSortOrderNumber() - b.getSortOrderNumber();
        })
    }

    getCountOfPortfolioItems(): number {
        return this.portfolioItems.length;
    }
}