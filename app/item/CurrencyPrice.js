"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CurrencyPrice = /** @class */ (function () {
    function CurrencyPrice(codeFrom, codeTo, platform) {
        this.currencyCodeFrom = codeFrom.toLowerCase();
        this.currencyCodeTo = codeTo.toLowerCase();
        this.platform = platform.toLowerCase();
    }
    ;
    CurrencyPrice.prototype.setDescription = function (description) {
        this.currencyPriceDescription = description;
    };
    CurrencyPrice.prototype.getDescription = function () {
        return this.currencyPriceDescription;
    };
    CurrencyPrice.prototype.getSymbol = function () {
        return this.currencyCodeFrom + this.currencyCodeTo;
    };
    CurrencyPrice.prototype.setPrice = function (newPrice) {
        this.price = newPrice;
    };
    CurrencyPrice.prototype.isRelevantForDisplay = function () {
        //description is mandatory for those currency prices which are displayed
        return !!this.currencyPriceDescription;
    };
    return CurrencyPrice;
}());
exports.CurrencyPrice = CurrencyPrice;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3VycmVuY3lQcmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkN1cnJlbmN5UHJpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtJQU9JLHVCQUFZLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUTtRQUNsQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQy9DLElBQUksQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzNDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzFDLENBQUM7SUFBQSxDQUFDO0lBRUYsc0NBQWMsR0FBZCxVQUFlLFdBQW1CO1FBQzlCLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxXQUFXLENBQUM7SUFDaEQsQ0FBQztJQUVELHNDQUFjLEdBQWQ7UUFDSSxPQUFPLElBQUksQ0FBQyx3QkFBd0IsQ0FBQztJQUN6QyxDQUFDO0lBRUQsaUNBQVMsR0FBVDtRQUNJLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDdkQsQ0FBQztJQUVELGdDQUFRLEdBQVIsVUFBUyxRQUFnQjtRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztJQUMxQixDQUFDO0lBRUQsNENBQW9CLEdBQXBCO1FBQ0ksd0VBQXdFO1FBQ3hFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQztJQUMzQyxDQUFDO0lBQ04sb0JBQUM7QUFBRCxDQUFDLEFBakNELElBaUNDO0FBakNZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEN1cnJlbmN5UHJpY2Uge1xuICAgIHBsYXRmb3JtOiBzdHJpbmc7XG4gICAgY3VycmVuY3lQcmljZURlc2NyaXB0aW9uOiBzdHJpbmc7XG4gICAgY3VycmVuY3lDb2RlRnJvbTogc3RyaW5nO1xuICAgIGN1cnJlbmN5Q29kZVRvOiBzdHJpbmc7XG4gICAgcHJpY2U6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKGNvZGVGcm9tLCBjb2RlVG8sIHBsYXRmb3JtKSB7XG4gICAgICAgIHRoaXMuY3VycmVuY3lDb2RlRnJvbSA9IGNvZGVGcm9tLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHRoaXMuY3VycmVuY3lDb2RlVG8gPSBjb2RlVG8udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgdGhpcy5wbGF0Zm9ybSA9IHBsYXRmb3JtLnRvTG93ZXJDYXNlKCk7XG4gICAgIH07XG5cbiAgICAgc2V0RGVzY3JpcHRpb24oZGVzY3JpcHRpb246IHN0cmluZykge1xuICAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlRGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICAgfVxuXG4gICAgIGdldERlc2NyaXB0aW9uKCkge1xuICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVuY3lQcmljZURlc2NyaXB0aW9uO1xuICAgICB9XG5cbiAgICAgZ2V0U3ltYm9sKCk6IHN0cmluZyB7XG4gICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW5jeUNvZGVGcm9tICsgdGhpcy5jdXJyZW5jeUNvZGVUbztcbiAgICAgfVxuXG4gICAgIHNldFByaWNlKG5ld1ByaWNlOiBudW1iZXIpIHtcbiAgICAgICAgIHRoaXMucHJpY2UgPSBuZXdQcmljZTtcbiAgICAgfVxuXG4gICAgIGlzUmVsZXZhbnRGb3JEaXNwbGF5KCk6IGJvb2xlYW4ge1xuICAgICAgICAgLy9kZXNjcmlwdGlvbiBpcyBtYW5kYXRvcnkgZm9yIHRob3NlIGN1cnJlbmN5IHByaWNlcyB3aGljaCBhcmUgZGlzcGxheWVkXG4gICAgICAgICByZXR1cm4gISF0aGlzLmN1cnJlbmN5UHJpY2VEZXNjcmlwdGlvbjtcbiAgICAgfVxufVxuIl19