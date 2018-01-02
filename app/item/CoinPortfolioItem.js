"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CoinPortfolioItem = (function () {
    function CoinPortfolioItem(platform, portfolioItemName, portfolioItemDescription, symbol, quantity) {
        this.platform = platform;
        this.portfolioItemName = portfolioItemName;
        this.portfolioItemDescription = portfolioItemDescription;
        this.symbol = symbol;
        if (quantity) {
            this.quantity = quantity;
        }
        else {
            this.quantity = 0;
        }
    }
    CoinPortfolioItem.prototype.getQuantity = function () {
        return this.quantity;
    };
    CoinPortfolioItem.prototype.setQuantity = function (quantity) {
        this.quantity = quantity;
    };
    CoinPortfolioItem.prototype.getPortfolioName = function () {
        return this.platform;
    };
    CoinPortfolioItem.prototype.setPortfolioName = function (portfolioName) {
        this.platform = portfolioName;
    };
    CoinPortfolioItem.prototype.getPortfolioItemName = function () {
        return this.portfolioItemName;
    };
    CoinPortfolioItem.prototype.setPortfolioItemName = function (portfolioItemName) {
        this.portfolioItemName = portfolioItemName;
    };
    CoinPortfolioItem.prototype.getPortfolioItemDescription = function () {
        return this.portfolioItemDescription;
    };
    CoinPortfolioItem.prototype.setPortfolioItemDescription = function (portfolioItemDescription) {
        this.portfolioItemDescription = portfolioItemDescription;
    };
    CoinPortfolioItem.prototype.setSymbol = function (symbol) {
        this.symbol = symbol;
    };
    CoinPortfolioItem.prototype.getSymbol = function () {
        return this.symbol;
    };
    return CoinPortfolioItem;
}());
exports.CoinPortfolioItem = CoinPortfolioItem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29pblBvcnRmb2xpb0l0ZW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDb2luUG9ydGZvbGlvSXRlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0lBT0ksMkJBQVksUUFBUSxFQUFFLGlCQUFpQixFQUFFLHdCQUF3QixFQUFFLE1BQU0sRUFBRSxRQUFTO1FBQ2hGLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztRQUMzQyxJQUFJLENBQUMsd0JBQXdCLEdBQUcsd0JBQXdCLENBQUM7UUFDekQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsRUFBRSxDQUFBLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQzdCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLENBQUM7SUFDTCxDQUFDO0lBRUQsdUNBQVcsR0FBWDtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFFRCx1Q0FBVyxHQUFYLFVBQVksUUFBZ0I7UUFDeEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDN0IsQ0FBQztJQUdELDRDQUFnQixHQUFoQjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFFRCw0Q0FBZ0IsR0FBaEIsVUFBaUIsYUFBcUI7UUFDbEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxhQUFhLENBQUM7SUFDbEMsQ0FBQztJQUVELGdEQUFvQixHQUFwQjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUM7SUFDbEMsQ0FBQztJQUVELGdEQUFvQixHQUFwQixVQUFxQixpQkFBeUI7UUFDMUMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO0lBQy9DLENBQUM7SUFFRCx1REFBMkIsR0FBM0I7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDO0lBQ3pDLENBQUM7SUFFRCx1REFBMkIsR0FBM0IsVUFBNEIsd0JBQWdDO1FBQ3hELElBQUksQ0FBQyx3QkFBd0IsR0FBRyx3QkFBd0IsQ0FBQztJQUM3RCxDQUFDO0lBRUQscUNBQVMsR0FBVCxVQUFVLE1BQWE7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekIsQ0FBQztJQUVELHFDQUFTLEdBQVQ7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBQ0wsd0JBQUM7QUFBRCxDQUFDLEFBM0RELElBMkRDO0FBM0RZLDhDQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBDb2luUG9ydGZvbGlvSXRlbSB7XG4gICAgcHJpdmF0ZSBwbGF0Zm9ybTogc3RyaW5nO1xuICAgIHByaXZhdGUgcG9ydGZvbGlvSXRlbU5hbWU6IHN0cmluZztcbiAgICBwcml2YXRlIHBvcnRmb2xpb0l0ZW1EZXNjcmlwdGlvbjogc3RyaW5nO1xuICAgIHByaXZhdGUgcXVhbnRpdHk6IG51bWJlcjtcbiAgICBwcml2YXRlIHN5bWJvbDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IocGxhdGZvcm0sIHBvcnRmb2xpb0l0ZW1OYW1lLCBwb3J0Zm9saW9JdGVtRGVzY3JpcHRpb24sIHN5bWJvbCwgcXVhbnRpdHk/KSB7XG4gICAgICAgIHRoaXMucGxhdGZvcm0gPSBwbGF0Zm9ybTtcbiAgICAgICAgdGhpcy5wb3J0Zm9saW9JdGVtTmFtZSA9IHBvcnRmb2xpb0l0ZW1OYW1lO1xuICAgICAgICB0aGlzLnBvcnRmb2xpb0l0ZW1EZXNjcmlwdGlvbiA9IHBvcnRmb2xpb0l0ZW1EZXNjcmlwdGlvbjtcbiAgICAgICAgdGhpcy5zeW1ib2wgPSBzeW1ib2w7XG4gICAgICAgIGlmKHF1YW50aXR5KSB7XG4gICAgICAgICAgICB0aGlzLnF1YW50aXR5ID0gcXVhbnRpdHk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnF1YW50aXR5ID0gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFF1YW50aXR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5xdWFudGl0eTtcbiAgICB9XG5cbiAgICBzZXRRdWFudGl0eShxdWFudGl0eTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucXVhbnRpdHkgPSBxdWFudGl0eTtcbiAgICB9XG5cblxuICAgIGdldFBvcnRmb2xpb05hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBsYXRmb3JtO1xuICAgIH1cblxuICAgIHNldFBvcnRmb2xpb05hbWUocG9ydGZvbGlvTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMucGxhdGZvcm0gPSBwb3J0Zm9saW9OYW1lO1xuICAgIH1cblxuICAgIGdldFBvcnRmb2xpb0l0ZW1OYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3J0Zm9saW9JdGVtTmFtZTtcbiAgICB9XG5cbiAgICBzZXRQb3J0Zm9saW9JdGVtTmFtZShwb3J0Zm9saW9JdGVtTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMucG9ydGZvbGlvSXRlbU5hbWUgPSBwb3J0Zm9saW9JdGVtTmFtZTtcbiAgICB9XG5cbiAgICBnZXRQb3J0Zm9saW9JdGVtRGVzY3JpcHRpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcnRmb2xpb0l0ZW1EZXNjcmlwdGlvbjtcbiAgICB9XG5cbiAgICBzZXRQb3J0Zm9saW9JdGVtRGVzY3JpcHRpb24ocG9ydGZvbGlvSXRlbURlc2NyaXB0aW9uOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5wb3J0Zm9saW9JdGVtRGVzY3JpcHRpb24gPSBwb3J0Zm9saW9JdGVtRGVzY3JpcHRpb247XG4gICAgfVxuXG4gICAgc2V0U3ltYm9sKHN5bWJvbDpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zeW1ib2wgPSBzeW1ib2w7XG4gICAgfVxuXG4gICAgZ2V0U3ltYm9sKCk6c3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ltYm9sO1xuICAgIH1cbn0iXX0=