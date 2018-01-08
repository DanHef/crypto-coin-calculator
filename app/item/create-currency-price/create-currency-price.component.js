"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var currency_price_service_1 = require("../services/currency-price.service");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var nativescript_drop_down_1 = require("nativescript-drop-down");
var CreateCurrencyPriceComponent = (function () {
    function CreateCurrencyPriceComponent(currencyPriceService, router, routerExtension) {
        this.currencyPriceService = currencyPriceService;
        this.router = router;
        this.routerExtension = routerExtension;
        this.platformList = new nativescript_drop_down_1.ValueList([
            { value: "bitstamp", display: "Bitstamp" },
            { value: "bitfinex", display: "Bitfinex" }
        ]);
        this.selectedIndexPlatformList = this.platformList.getIndex("bitstamp");
        this.platform = this.platformList.getValue(this.selectedIndexPlatformList);
    }
    CreateCurrencyPriceComponent.prototype.ngOnInit = function () {
        this.fillSymbolsList("bitstamp");
    };
    CreateCurrencyPriceComponent.prototype.createCurrencyPrice = function () {
        if (!this.description ||
            !this.codeFrom ||
            !this.codeTo ||
            !this.platform) {
            alert("Bitte alle Felder ausfüllen");
        }
        else {
            this.currencyPriceService.createCurrencyPrice(this.codeFrom, this.codeTo, this.description, this.platform);
            this.currencyPriceService.saveCurrencyPrices();
            this.routerExtension.back();
        }
    };
    CreateCurrencyPriceComponent.prototype.onPlatformChange = function (event) {
        this.platform = this.platformList.getValue(event.newIndex);
        this.fillSymbolsList(this.platform);
    };
    CreateCurrencyPriceComponent.prototype.onCurrencyCodeFromChange = function (event) {
        this.codeFrom = this.currencySymbolList.getValue(event.newIndex);
    };
    CreateCurrencyPriceComponent.prototype.onCurrencyCodeToChange = function (event) {
        this.codeTo = this.currencySymbolList.getValue(event.newIndex);
    };
    CreateCurrencyPriceComponent.prototype.fillSymbolsList = function (platform) {
        var distinctSymbols = this.currencyPriceService.getDistinctCurrencySymbols(platform);
        var newValueList = new nativescript_drop_down_1.ValueList();
        for (var i = 0; i < distinctSymbols.length; i++) {
            var newValueItem = { value: distinctSymbols[i], display: distinctSymbols[i] };
            newValueList.push(newValueItem);
        }
        this.currencySymbolList = newValueList;
    };
    CreateCurrencyPriceComponent = __decorate([
        core_1.Component({
            selector: "create-currency-price",
            moduleId: module.id,
            templateUrl: "./create-currency-price.component.html",
        }),
        __metadata("design:paramtypes", [currency_price_service_1.CurrencyPriceService,
            router_1.Router,
            router_2.RouterExtensions])
    ], CreateCurrencyPriceComponent);
    return CreateCurrencyPriceComponent;
}());
exports.CreateCurrencyPriceComponent = CreateCurrencyPriceComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWN1cnJlbmN5LXByaWNlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyZWF0ZS1jdXJyZW5jeS1wcmljZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBOEY7QUFHOUYsNkVBQTBFO0FBRzFFLDBDQUF5QztBQUN6QyxzREFBK0Q7QUFFL0QsaUVBQW1EO0FBT25EO0lBa0JJLHNDQUE2QixvQkFBMEMsRUFDbEQsTUFBYyxFQUNkLGVBQWlDO1FBRnpCLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDbEQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLG9CQUFlLEdBQWYsZUFBZSxDQUFrQjtRQWZ0RCxpQkFBWSxHQUFzQixJQUFJLGtDQUFTLENBQVM7WUFDcEQsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUU7WUFDMUMsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUU7U0FDN0MsQ0FBQyxDQUFDO1FBQ0gsOEJBQXlCLEdBQVcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFM0UsYUFBUSxHQUFXLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBU3BCLENBQUM7SUFFM0QsK0NBQVEsR0FBUjtRQUNJLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELDBEQUFtQixHQUFuQjtRQUNJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVc7WUFDakIsQ0FBQyxJQUFJLENBQUMsUUFBUTtZQUNkLENBQUMsSUFBSSxDQUFDLE1BQU07WUFDWixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBQ3pDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFM0csSUFBSSxDQUFDLG9CQUFvQixDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDL0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNoQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHVEQUFnQixHQUFoQixVQUFpQixLQUFLO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCwrREFBd0IsR0FBeEIsVUFBeUIsS0FBSztRQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFRCw2REFBc0IsR0FBdEIsVUFBdUIsS0FBSztRQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFTyxzREFBZSxHQUF2QixVQUF3QixRQUFnQjtRQUNwQyxJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsMEJBQTBCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckYsSUFBSSxZQUFZLEdBQUcsSUFBSSxrQ0FBUyxFQUFVLENBQUM7UUFFM0MsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDOUMsSUFBSSxZQUFZLEdBQUcsRUFBRSxLQUFLLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUM5RSxZQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFFRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsWUFBWSxDQUFDO0lBQzNDLENBQUM7SUEvRFEsNEJBQTRCO1FBTHhDLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsdUJBQXVCO1lBQ2pDLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixXQUFXLEVBQUUsd0NBQXdDO1NBQ3hELENBQUM7eUNBbUJxRCw2Q0FBb0I7WUFDMUMsZUFBTTtZQUNHLHlCQUFnQjtPQXBCN0MsNEJBQTRCLENBZ0V4QztJQUFELG1DQUFDO0NBQUEsQUFoRUQsSUFnRUM7QUFoRVksb0VBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCwgQWZ0ZXJWaWV3SW5pdCwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBDb2luUG9ydGZvbGlvSXRlbSB9IGZyb20gXCIuLi9Db2luUG9ydGZvbGlvSXRlbVwiO1xuXG5pbXBvcnQgeyBDdXJyZW5jeVByaWNlU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9jdXJyZW5jeS1wcmljZS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBDdXJyZW5jeVByaWNlIH0gZnJvbSBcIi4uL0N1cnJlbmN5UHJpY2VcIjtcblxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcblxuaW1wb3J0IHsgVmFsdWVMaXN0IH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1kcm9wLWRvd25cIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwiY3JlYXRlLWN1cnJlbmN5LXByaWNlXCIsXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2NyZWF0ZS1jdXJyZW5jeS1wcmljZS5jb21wb25lbnQuaHRtbFwiLFxufSlcbmV4cG9ydCBjbGFzcyBDcmVhdGVDdXJyZW5jeVByaWNlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBjb2RlRnJvbTogc3RyaW5nO1xuICAgIGNvZGVUbzogc3RyaW5nO1xuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG5cbiAgICBwbGF0Zm9ybUxpc3Q6IFZhbHVlTGlzdDxzdHJpbmc+ID0gbmV3IFZhbHVlTGlzdDxzdHJpbmc+KFtcbiAgICAgICAgeyB2YWx1ZTogXCJiaXRzdGFtcFwiLCBkaXNwbGF5OiBcIkJpdHN0YW1wXCIgfSxcbiAgICAgICAgeyB2YWx1ZTogXCJiaXRmaW5leFwiLCBkaXNwbGF5OiBcIkJpdGZpbmV4XCIgfVxuICAgIF0pO1xuICAgIHNlbGVjdGVkSW5kZXhQbGF0Zm9ybUxpc3Q6IG51bWJlciA9IHRoaXMucGxhdGZvcm1MaXN0LmdldEluZGV4KFwiYml0c3RhbXBcIik7XG5cbiAgICBwbGF0Zm9ybTogc3RyaW5nID0gdGhpcy5wbGF0Zm9ybUxpc3QuZ2V0VmFsdWUodGhpcy5zZWxlY3RlZEluZGV4UGxhdGZvcm1MaXN0KTtcblxuICAgIGN1cnJlbmN5U3ltYm9sTGlzdDogVmFsdWVMaXN0PHN0cmluZz47XG4gICAgc2VsZWN0ZWRJbmRleENvZGVGcm9tOiBudW1iZXI7XG4gICAgc2VsZWN0ZWRJbmRleENvZGVUbzogbnVtYmVyO1xuXG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGN1cnJlbmN5UHJpY2VTZXJ2aWNlOiBDdXJyZW5jeVByaWNlU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSByb3V0ZXI6IFJvdXRlcixcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSByb3V0ZXJFeHRlbnNpb246IFJvdXRlckV4dGVuc2lvbnMpIHsgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuZmlsbFN5bWJvbHNMaXN0KFwiYml0c3RhbXBcIik7XG4gICAgfVxuXG4gICAgY3JlYXRlQ3VycmVuY3lQcmljZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRlc2NyaXB0aW9uIHx8XG4gICAgICAgICAgICAhdGhpcy5jb2RlRnJvbSB8fFxuICAgICAgICAgICAgIXRoaXMuY29kZVRvIHx8XG4gICAgICAgICAgICAhdGhpcy5wbGF0Zm9ybSkge1xuICAgICAgICAgICAgYWxlcnQoXCJCaXR0ZSBhbGxlIEZlbGRlciBhdXNmw7xsbGVuXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5jcmVhdGVDdXJyZW5jeVByaWNlKHRoaXMuY29kZUZyb20sIHRoaXMuY29kZVRvLCB0aGlzLmRlc2NyaXB0aW9uLCB0aGlzLnBsYXRmb3JtKTtcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5zYXZlQ3VycmVuY3lQcmljZXMoKTtcbiAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9uLmJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uUGxhdGZvcm1DaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5wbGF0Zm9ybSA9IHRoaXMucGxhdGZvcm1MaXN0LmdldFZhbHVlKGV2ZW50Lm5ld0luZGV4KTtcbiAgICAgICAgdGhpcy5maWxsU3ltYm9sc0xpc3QodGhpcy5wbGF0Zm9ybSk7XG4gICAgfVxuXG4gICAgb25DdXJyZW5jeUNvZGVGcm9tQ2hhbmdlKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuY29kZUZyb20gPSB0aGlzLmN1cnJlbmN5U3ltYm9sTGlzdC5nZXRWYWx1ZShldmVudC5uZXdJbmRleCk7XG4gICAgfVxuXG4gICAgb25DdXJyZW5jeUNvZGVUb0NoYW5nZShldmVudCkge1xuICAgICAgICB0aGlzLmNvZGVUbyA9IHRoaXMuY3VycmVuY3lTeW1ib2xMaXN0LmdldFZhbHVlKGV2ZW50Lm5ld0luZGV4KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZpbGxTeW1ib2xzTGlzdChwbGF0Zm9ybTogc3RyaW5nKSB7XG4gICAgICAgIGxldCBkaXN0aW5jdFN5bWJvbHMgPSB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmdldERpc3RpbmN0Q3VycmVuY3lTeW1ib2xzKHBsYXRmb3JtKTtcbiAgICAgICAgbGV0IG5ld1ZhbHVlTGlzdCA9IG5ldyBWYWx1ZUxpc3Q8c3RyaW5nPigpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGlzdGluY3RTeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbmV3VmFsdWVJdGVtID0geyB2YWx1ZTogZGlzdGluY3RTeW1ib2xzW2ldLCBkaXNwbGF5OiBkaXN0aW5jdFN5bWJvbHNbaV0gfTtcbiAgICAgICAgICAgIG5ld1ZhbHVlTGlzdC5wdXNoKG5ld1ZhbHVlSXRlbSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbmN5U3ltYm9sTGlzdCA9IG5ld1ZhbHVlTGlzdDtcbiAgICB9XG59Il19