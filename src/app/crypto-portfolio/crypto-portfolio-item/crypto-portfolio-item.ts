import { CryptoPlatform } from "src/app/crypto-platform/crypto-platform.enum";

export interface ICryptoPortfolioItem {
    id: number;
    name: string;
    quantity: number;
    platform: CryptoPlatform;
    currencyCode: string;
    sortOrderNumber: number;
}

export class CryptoPortfolioItem implements ICryptoPortfolioItem {
    id: number;
    name: string;
    quantity: number;
    platform: CryptoPlatform;
    currencyCode: string;
    sortOrderNumber: number;

    constructor(name: string, quantity: number, platform: CryptoPlatform, currencyCode: string, sortOrderNumber: number = 1) {
        this.name = name;
        this.quantity = quantity;
        this.platform = platform;
        this.currencyCode = currencyCode;
        this.sortOrderNumber = sortOrderNumber;
    }
}