"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CoinPortfolioItem = /** @class */ (function () {
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
    CoinPortfolioItem.prototype.setSortOrderNumber = function (sortOrderNumber) {
        this.sortOrderNumber = sortOrderNumber;
    };
    CoinPortfolioItem.prototype.getSortOrderNumber = function () {
        return this.sortOrderNumber;
    };
    return CoinPortfolioItem;
}());
exports.CoinPortfolioItem = CoinPortfolioItem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29pblBvcnRmb2xpb0l0ZW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDb2luUG9ydGZvbGlvSXRlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0lBUUksMkJBQVksUUFBUSxFQUFFLGlCQUFpQixFQUFFLHdCQUF3QixFQUFFLE1BQU0sRUFBRSxRQUFTO1FBQ2hGLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN6RCxJQUFJLENBQUMsd0JBQXdCLEdBQUcsd0JBQXdCLENBQUM7UUFDekQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkMsSUFBRyxRQUFRLEVBQUU7WUFDVCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztTQUM1QjthQUFNO1lBQ0gsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7U0FDckI7SUFDTCxDQUFDO0lBRUQsdUNBQVcsR0FBWDtRQUNJLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QixDQUFDO0lBRUQsdUNBQVcsR0FBWCxVQUFZLFFBQWdCO1FBQ3hCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFHRCw0Q0FBZ0IsR0FBaEI7UUFDSSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDekIsQ0FBQztJQUVELDRDQUFnQixHQUFoQixVQUFpQixRQUFnQjtRQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUMzQyxDQUFDO0lBRUQsZ0RBQW9CLEdBQXBCO1FBQ0ksT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUM7SUFDbEMsQ0FBQztJQUVELGdEQUFvQixHQUFwQixVQUFxQixpQkFBeUI7UUFDMUMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzdELENBQUM7SUFFRCx1REFBMkIsR0FBM0I7UUFDSSxPQUFPLElBQUksQ0FBQyx3QkFBd0IsQ0FBQztJQUN6QyxDQUFDO0lBRUQsdURBQTJCLEdBQTNCLFVBQTRCLHdCQUFnQztRQUN4RCxJQUFJLENBQUMsd0JBQXdCLEdBQUcsd0JBQXdCLENBQUM7SUFDN0QsQ0FBQztJQUVELHFDQUFTLEdBQVQsVUFBVSxNQUFhO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxxQ0FBUyxHQUFUO1FBQ0ksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCw4Q0FBa0IsR0FBbEIsVUFBbUIsZUFBdUI7UUFDdEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7SUFDM0MsQ0FBQztJQUVELDhDQUFrQixHQUFsQjtRQUNJLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUNoQyxDQUFDO0lBQ0wsd0JBQUM7QUFBRCxDQUFDLEFBcEVELElBb0VDO0FBcEVZLDhDQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBDb2luUG9ydGZvbGlvSXRlbSB7XG4gICAgcHJpdmF0ZSBwbGF0Zm9ybTogc3RyaW5nO1xuICAgIHByaXZhdGUgcG9ydGZvbGlvSXRlbU5hbWU6IHN0cmluZztcbiAgICBwcml2YXRlIHBvcnRmb2xpb0l0ZW1EZXNjcmlwdGlvbjogc3RyaW5nO1xuICAgIHByaXZhdGUgcXVhbnRpdHk6IG51bWJlcjtcbiAgICBwcml2YXRlIHN5bWJvbDogc3RyaW5nO1xuICAgIHByaXZhdGUgc29ydE9yZGVyTnVtYmVyOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihwbGF0Zm9ybSwgcG9ydGZvbGlvSXRlbU5hbWUsIHBvcnRmb2xpb0l0ZW1EZXNjcmlwdGlvbiwgc3ltYm9sLCBxdWFudGl0eT8pIHtcbiAgICAgICAgdGhpcy5wbGF0Zm9ybSA9IHBsYXRmb3JtLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHRoaXMucG9ydGZvbGlvSXRlbU5hbWUgPSBwb3J0Zm9saW9JdGVtTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB0aGlzLnBvcnRmb2xpb0l0ZW1EZXNjcmlwdGlvbiA9IHBvcnRmb2xpb0l0ZW1EZXNjcmlwdGlvbjtcbiAgICAgICAgdGhpcy5zeW1ib2wgPSBzeW1ib2wudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYocXVhbnRpdHkpIHtcbiAgICAgICAgICAgIHRoaXMucXVhbnRpdHkgPSBxdWFudGl0eTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucXVhbnRpdHkgPSAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0UXVhbnRpdHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnF1YW50aXR5O1xuICAgIH1cblxuICAgIHNldFF1YW50aXR5KHF1YW50aXR5OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5xdWFudGl0eSA9IHF1YW50aXR5O1xuICAgIH1cblxuXG4gICAgZ2V0UG9ydGZvbGlvTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGxhdGZvcm07XG4gICAgfVxuXG4gICAgc2V0UG9ydGZvbGlvTmFtZShwbGF0Zm9ybTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMucGxhdGZvcm0gPSBwbGF0Zm9ybS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIGdldFBvcnRmb2xpb0l0ZW1OYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3J0Zm9saW9JdGVtTmFtZTtcbiAgICB9XG5cbiAgICBzZXRQb3J0Zm9saW9JdGVtTmFtZShwb3J0Zm9saW9JdGVtTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMucG9ydGZvbGlvSXRlbU5hbWUgPSBwb3J0Zm9saW9JdGVtTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIGdldFBvcnRmb2xpb0l0ZW1EZXNjcmlwdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9ydGZvbGlvSXRlbURlc2NyaXB0aW9uO1xuICAgIH1cblxuICAgIHNldFBvcnRmb2xpb0l0ZW1EZXNjcmlwdGlvbihwb3J0Zm9saW9JdGVtRGVzY3JpcHRpb246IHN0cmluZykge1xuICAgICAgICB0aGlzLnBvcnRmb2xpb0l0ZW1EZXNjcmlwdGlvbiA9IHBvcnRmb2xpb0l0ZW1EZXNjcmlwdGlvbjtcbiAgICB9XG5cbiAgICBzZXRTeW1ib2woc3ltYm9sOnN0cmluZykge1xuICAgICAgICB0aGlzLnN5bWJvbCA9IHN5bWJvbC50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIGdldFN5bWJvbCgpOnN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bWJvbDtcbiAgICB9XG5cbiAgICBzZXRTb3J0T3JkZXJOdW1iZXIoc29ydE9yZGVyTnVtYmVyOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5zb3J0T3JkZXJOdW1iZXIgPSBzb3J0T3JkZXJOdW1iZXI7XG4gICAgfVxuXG4gICAgZ2V0U29ydE9yZGVyTnVtYmVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zb3J0T3JkZXJOdW1iZXI7XG4gICAgfVxufSJdfQ==