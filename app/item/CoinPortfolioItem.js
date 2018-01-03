"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CoinPortfolioItem = (function () {
    function CoinPortfolioItem(platform, portfolioItemName, portfolioItemDescription, symbol, quantity) {
        this.platform = platform.toLowerCase();
        this.portfolioItemName = portfolioItemName.toLowerCase();
        this.portfolioItemDescription = portfolioItemDescription;
        this.symbol = symbol.toLowerCase();
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
    CoinPortfolioItem.prototype.setPortfolioName = function (platform) {
        this.platform = platform.toLowerCase();
    };
    CoinPortfolioItem.prototype.getPortfolioItemName = function () {
        return this.portfolioItemName;
    };
    CoinPortfolioItem.prototype.setPortfolioItemName = function (portfolioItemName) {
        this.portfolioItemName = portfolioItemName.toLowerCase();
    };
    CoinPortfolioItem.prototype.getPortfolioItemDescription = function () {
        return this.portfolioItemDescription;
    };
    CoinPortfolioItem.prototype.setPortfolioItemDescription = function (portfolioItemDescription) {
        this.portfolioItemDescription = portfolioItemDescription;
    };
    CoinPortfolioItem.prototype.setSymbol = function (symbol) {
        this.symbol = symbol.toLowerCase();
    };
    CoinPortfolioItem.prototype.getSymbol = function () {
        return this.symbol;
    };
    return CoinPortfolioItem;
}());
exports.CoinPortfolioItem = CoinPortfolioItem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29pblBvcnRmb2xpb0l0ZW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDb2luUG9ydGZvbGlvSXRlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0lBT0ksMkJBQVksUUFBUSxFQUFFLGlCQUFpQixFQUFFLHdCQUF3QixFQUFFLE1BQU0sRUFBRSxRQUFTO1FBQ2hGLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN6RCxJQUFJLENBQUMsd0JBQXdCLEdBQUcsd0JBQXdCLENBQUM7UUFDekQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkMsRUFBRSxDQUFBLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQzdCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLENBQUM7SUFDTCxDQUFDO0lBRUQsdUNBQVcsR0FBWDtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFFRCx1Q0FBVyxHQUFYLFVBQVksUUFBZ0I7UUFDeEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDN0IsQ0FBQztJQUdELDRDQUFnQixHQUFoQjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFFRCw0Q0FBZ0IsR0FBaEIsVUFBaUIsUUFBZ0I7UUFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDM0MsQ0FBQztJQUVELGdEQUFvQixHQUFwQjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUM7SUFDbEMsQ0FBQztJQUVELGdEQUFvQixHQUFwQixVQUFxQixpQkFBeUI7UUFDMUMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzdELENBQUM7SUFFRCx1REFBMkIsR0FBM0I7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDO0lBQ3pDLENBQUM7SUFFRCx1REFBMkIsR0FBM0IsVUFBNEIsd0JBQWdDO1FBQ3hELElBQUksQ0FBQyx3QkFBd0IsR0FBRyx3QkFBd0IsQ0FBQztJQUM3RCxDQUFDO0lBRUQscUNBQVMsR0FBVCxVQUFVLE1BQWE7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUVELHFDQUFTLEdBQVQ7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBQ0wsd0JBQUM7QUFBRCxDQUFDLEFBM0RELElBMkRDO0FBM0RZLDhDQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBDb2luUG9ydGZvbGlvSXRlbSB7XG4gICAgcHJpdmF0ZSBwbGF0Zm9ybTogc3RyaW5nO1xuICAgIHByaXZhdGUgcG9ydGZvbGlvSXRlbU5hbWU6IHN0cmluZztcbiAgICBwcml2YXRlIHBvcnRmb2xpb0l0ZW1EZXNjcmlwdGlvbjogc3RyaW5nO1xuICAgIHByaXZhdGUgcXVhbnRpdHk6IG51bWJlcjtcbiAgICBwcml2YXRlIHN5bWJvbDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IocGxhdGZvcm0sIHBvcnRmb2xpb0l0ZW1OYW1lLCBwb3J0Zm9saW9JdGVtRGVzY3JpcHRpb24sIHN5bWJvbCwgcXVhbnRpdHk/KSB7XG4gICAgICAgIHRoaXMucGxhdGZvcm0gPSBwbGF0Zm9ybS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB0aGlzLnBvcnRmb2xpb0l0ZW1OYW1lID0gcG9ydGZvbGlvSXRlbU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgdGhpcy5wb3J0Zm9saW9JdGVtRGVzY3JpcHRpb24gPSBwb3J0Zm9saW9JdGVtRGVzY3JpcHRpb247XG4gICAgICAgIHRoaXMuc3ltYm9sID0gc3ltYm9sLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmKHF1YW50aXR5KSB7XG4gICAgICAgICAgICB0aGlzLnF1YW50aXR5ID0gcXVhbnRpdHk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnF1YW50aXR5ID0gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFF1YW50aXR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5xdWFudGl0eTtcbiAgICB9XG5cbiAgICBzZXRRdWFudGl0eShxdWFudGl0eTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucXVhbnRpdHkgPSBxdWFudGl0eTtcbiAgICB9XG5cblxuICAgIGdldFBvcnRmb2xpb05hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBsYXRmb3JtO1xuICAgIH1cblxuICAgIHNldFBvcnRmb2xpb05hbWUocGxhdGZvcm06IHN0cmluZykge1xuICAgICAgICB0aGlzLnBsYXRmb3JtID0gcGxhdGZvcm0udG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICBnZXRQb3J0Zm9saW9JdGVtTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9ydGZvbGlvSXRlbU5hbWU7XG4gICAgfVxuXG4gICAgc2V0UG9ydGZvbGlvSXRlbU5hbWUocG9ydGZvbGlvSXRlbU5hbWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLnBvcnRmb2xpb0l0ZW1OYW1lID0gcG9ydGZvbGlvSXRlbU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICBnZXRQb3J0Zm9saW9JdGVtRGVzY3JpcHRpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcnRmb2xpb0l0ZW1EZXNjcmlwdGlvbjtcbiAgICB9XG5cbiAgICBzZXRQb3J0Zm9saW9JdGVtRGVzY3JpcHRpb24ocG9ydGZvbGlvSXRlbURlc2NyaXB0aW9uOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5wb3J0Zm9saW9JdGVtRGVzY3JpcHRpb24gPSBwb3J0Zm9saW9JdGVtRGVzY3JpcHRpb247XG4gICAgfVxuXG4gICAgc2V0U3ltYm9sKHN5bWJvbDpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zeW1ib2wgPSBzeW1ib2wudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICBnZXRTeW1ib2woKTpzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW1ib2w7XG4gICAgfVxufSJdfQ==