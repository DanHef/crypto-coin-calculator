import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";

import { CoinPortfolioItem } from "../CoinPortfolioItem";
import { SecureStorage } from "nativescript-secure-storage";

@Injectable()
export class PortfolioItemService {
    portfolioItems: Array<CoinPortfolioItem> = [];
    secureStorage: SecureStorage = new SecureStorage();

    constructor() { }

    addPortfolioItem(portfolioItem) {
        this.portfolioItems.push(portfolioItem);
    }


    createPortfolioItem(technicalName: string, description: string, 
                        quantity: number, platform: string, symbol: string): CoinPortfolioItem {
        if(!technicalName || !description || !platform) {
            return null;
        }
        let portfolioItem = new CoinPortfolioItem(platform, technicalName, description, symbol, quantity);

        this.portfolioItems.push(portfolioItem);

        return portfolioItem;
    }


    getPortfolioItemByTechnicalName(technicalName: string, platform: string): CoinPortfolioItem {
        for(var i=0; i<this.portfolioItems.length; i++) {
            if(this.portfolioItems[i].getPortfolioItemName() === technicalName) {
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
        let storedPortfolioString = this.secureStorage.getSync({
            key: "cryptoCoinCalcPortfolio",
        });

        if (storedPortfolioString) {
            let storedPortfolio = JSON.parse(storedPortfolioString);
            for (var i = 0; i < storedPortfolio.length; i++) {
                let storedPortfolioItem = storedPortfolio[i];
                let portfolioItem = this.getPortfolioItemByTechnicalName(storedPortfolioItem.portfolioItemName,
                    storedPortfolioItem.portfolioName);

                if (portfolioItem) {
                    portfolioItem.setQuantity(storedPortfolioItem.quantity);
                } else {
                    console.log("PortfolioItem " + storedPortfolioItem.portfolioItemName + " not created");
                }
            }
        }
    }

    getCountOfPortfolioItems(): number {
        return this.portfolioItems.length;
    }
}