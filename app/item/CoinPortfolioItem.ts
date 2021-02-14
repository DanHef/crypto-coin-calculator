export class CoinPortfolioItem {
    private platform: string;
    private portfolioItemName: string;
    private portfolioItemDescription: string;
    private quantity: number;
    private symbol: string;
    private sortOrderNumber: number;

    constructor(platform, portfolioItemName, portfolioItemDescription, symbol, quantity?) {
        this.platform = platform.toLowerCase();
        this.portfolioItemName = portfolioItemName.toLowerCase();
        this.portfolioItemDescription = portfolioItemDescription;
        this.symbol = symbol.toLowerCase();
        if(quantity) {
            this.quantity = quantity;
        } else {
            this.quantity = 0;
        }
    }

    getQuantity() {
        return this.quantity;
    }

    setQuantity(quantity: number) {
        this.quantity = quantity;
    }


    getPortfolioName() {
        return this.platform;
    }

    setPortfolioName(platform: string) {
        this.platform = platform.toLowerCase();
    }

    getPortfolioItemName() {
        return this.portfolioItemName;
    }

    setPortfolioItemName(portfolioItemName: string) {
        this.portfolioItemName = portfolioItemName.toLowerCase();
    }

    getPortfolioItemDescription() {
        return this.portfolioItemDescription;
    }

    setPortfolioItemDescription(portfolioItemDescription: string) {
        this.portfolioItemDescription = portfolioItemDescription;
    }

    setSymbol(symbol:string) {
        this.symbol = symbol.toLowerCase();
    }

    getSymbol():string {
        return this.symbol;
    }

    setSortOrderNumber(sortOrderNumber: number) {
        this.sortOrderNumber = sortOrderNumber;
    }

    getSortOrderNumber() {
        return this.sortOrderNumber;
    }
}