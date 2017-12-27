export class CoinPortfolioItem {
    private portfolioName: string;
    private portfolioItemName: string;
    private portfolioItemDescription: string;
    private quantity: number;

    constructor() {
        this.quantity = 0;
    }

    getQuantity() {
        return this.quantity;
    }

    setQuantity(quantity: number) {
        this.quantity = quantity;
    }


    getPortfolioName() {
        return this.portfolioName;
    }

    setPortfolioName(portfolioName: string) {
        this.portfolioName = portfolioName;
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
}