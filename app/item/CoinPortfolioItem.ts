export class CoinPortfolioItem {
    private platform: string;
    private portfolioItemName: string;
    private portfolioItemDescription: string;
    private quantity: number;
    private symbol: string;

    constructor(platform, portfolioItemName, portfolioItemDescription, symbol, quantity?) {
        this.platform = platform;
        this.portfolioItemName = portfolioItemName;
        this.portfolioItemDescription = portfolioItemDescription;
        this.symbol = symbol;
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

    setPortfolioName(portfolioName: string) {
        this.platform = portfolioName;
    }

    getPortfolioItemName() {
        return this.portfolioItemName;
    }

    setPortfolioItemName(portfolioItemName: string) {
        this.portfolioItemName = portfolioItemName;
    }

    getPortfolioItemDescription() {
        return this.portfolioItemDescription;
    }

    setPortfolioItemDescription(portfolioItemDescription: string) {
        this.portfolioItemDescription = portfolioItemDescription;
    }

    setSymbol(symbol:string) {
        this.symbol = symbol;
    }

    getSymbol():string {
        return this.symbol;
    }
}