"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var portfolio_item_service_1 = require("../services/portfolio-item.service");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var nativescript_drop_down_1 = require("nativescript-drop-down");
var currency_price_service_1 = require("../services/currency-price.service");
var core_2 = require("@ngx-translate/core");
var CreatePortfolioItemComponent = /** @class */ (function () {
    function CreatePortfolioItemComponent(portfolioItemService, router, routerExtension, currencyPriceService, translateService) {
        this.portfolioItemService = portfolioItemService;
        this.router = router;
        this.routerExtension = routerExtension;
        this.currencyPriceService = currencyPriceService;
        this.translateService = translateService;
        this.platformList = new nativescript_drop_down_1.ValueList([
            { value: "bitstamp", display: "Bitstamp" },
            { value: "bitfinex", display: "Bitfinex" }
        ]);
        this.selectedIndexPlatformList = this.platformList.getIndex("bitstamp");
        this.portfolio = this.platformList.getValue(this.selectedIndexPlatformList);
    }
    CreatePortfolioItemComponent.prototype.ngOnInit = function () {
        this.fillSymbolsList("bitstamp");
    };
    CreatePortfolioItemComponent.prototype.onCreatePortfolioItem = function () {
        if (!this.description ||
            !this.portfolio ||
            !this.symbol ||
            !this.quantity ||
            !this.technicalName) {
            this.translateService.get("errorFillInAllFields").subscribe(function (translatedText) {
                alert(translatedText);
            });
        }
        else {
            this.portfolioItemService.createPortfolioItem(this.technicalName, this.description, this.quantity, this.portfolio, this.symbol);
            this.portfolioItemService.savePortfolio();
            this.routerExtension.back();
        }
    };
    CreatePortfolioItemComponent.prototype.onPlatformChange = function (event) {
        this.portfolio = this.platformList.getValue(event.newIndex);
        this.fillSymbolsList(this.portfolio);
    };
    CreatePortfolioItemComponent.prototype.onCurrencySymbolChange = function (event) {
        this.symbol = this.currencySymbolList.getValue(event.newIndex);
    };
    CreatePortfolioItemComponent.prototype.fillSymbolsList = function (platform) {
        var distinctSymbols = this.currencyPriceService.getDistinctCurrencySymbols(platform);
        var newValueList = new nativescript_drop_down_1.ValueList();
        for (var i = 0; i < distinctSymbols.length; i++) {
            var newValueItem = { value: distinctSymbols[i], display: distinctSymbols[i] };
            newValueList.push(newValueItem);
        }
        this.currencySymbolList = newValueList;
    };
    CreatePortfolioItemComponent = __decorate([
        core_1.Component({
            selector: "create-portfolio-item",
            moduleId: module.id,
            templateUrl: "./create-portfolio-item.component.html",
        }),
        __metadata("design:paramtypes", [portfolio_item_service_1.PortfolioItemService,
            router_1.Router,
            router_2.RouterExtensions,
            currency_price_service_1.CurrencyPriceService,
            core_2.TranslateService])
    ], CreatePortfolioItemComponent);
    return CreatePortfolioItemComponent;
}());
exports.CreatePortfolioItemComponent = CreatePortfolioItemComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXBvcnRmb2xpby1pdGVtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyZWF0ZS1wb3J0Zm9saW8taXRlbS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFHbEQsNkVBQTBFO0FBRTFFLDBDQUF5QztBQUN6QyxzREFBK0Q7QUFFL0QsaUVBQW1EO0FBRW5ELDZFQUEwRTtBQUMxRSw0Q0FBdUQ7QUFPdkQ7SUFpQkksc0NBQTZCLG9CQUEwQyxFQUMxQyxNQUFjLEVBQ2QsZUFBaUMsRUFDakMsb0JBQTBDLEVBQzFDLGdCQUFrQztRQUpsQyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQzFDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxvQkFBZSxHQUFmLGVBQWUsQ0FBa0I7UUFDakMseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUMxQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBZi9ELGlCQUFZLEdBQXNCLElBQUksa0NBQVMsQ0FBUztZQUNwRCxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTtZQUMxQyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTtTQUM3QyxDQUFDLENBQUM7UUFDSCw4QkFBeUIsR0FBVyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUUzRSxjQUFTLEdBQVcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFTWixDQUFDO0lBRXBFLCtDQUFRLEdBQVI7UUFDSSxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCw0REFBcUIsR0FBckI7UUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVc7WUFDakIsQ0FBQyxJQUFJLENBQUMsU0FBUztZQUNmLENBQUMsSUFBSSxDQUFDLE1BQU07WUFDWixDQUFDLElBQUksQ0FBQyxRQUFRO1lBQ2QsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQyxjQUFjO2dCQUN2RSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDLENBQUM7U0FDVjthQUFNO1lBQ0gsSUFBSSxDQUFDLG9CQUFvQixDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFDOUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsYUFBYSxFQUFFLENBQUM7WUFFMUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUMvQjtJQUNMLENBQUM7SUFFRCx1REFBZ0IsR0FBaEIsVUFBaUIsS0FBSztRQUNsQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsNkRBQXNCLEdBQXRCLFVBQXVCLEtBQUs7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBR08sc0RBQWUsR0FBdkIsVUFBd0IsUUFBZ0I7UUFDcEMsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLDBCQUEwQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JGLElBQUksWUFBWSxHQUFHLElBQUksa0NBQVMsRUFBVSxDQUFDO1FBRTNDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzdDLElBQUksWUFBWSxHQUFHLEVBQUUsS0FBSyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDOUUsWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNuQztRQUVELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxZQUFZLENBQUM7SUFDM0MsQ0FBQztJQWpFUSw0QkFBNEI7UUFMeEMsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSx1QkFBdUI7WUFDakMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSx3Q0FBd0M7U0FDeEQsQ0FBQzt5Q0FrQnFELDZDQUFvQjtZQUNsQyxlQUFNO1lBQ0cseUJBQWdCO1lBQ1gsNkNBQW9CO1lBQ3hCLHVCQUFnQjtPQXJCdEQsNEJBQTRCLENBa0V4QztJQUFELG1DQUFDO0NBQUEsQUFsRUQsSUFrRUM7QUFsRVksb0VBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQ29pblBvcnRmb2xpb0l0ZW0gfSBmcm9tIFwiLi4vQ29pblBvcnRmb2xpb0l0ZW1cIjtcblxuaW1wb3J0IHsgUG9ydGZvbGlvSXRlbVNlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvcG9ydGZvbGlvLWl0ZW0uc2VydmljZVwiO1xuXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuXG5pbXBvcnQgeyBWYWx1ZUxpc3QgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWRyb3AtZG93blwiO1xuXG5pbXBvcnQgeyBDdXJyZW5jeVByaWNlU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9jdXJyZW5jeS1wcmljZS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBUcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSBcIkBuZ3gtdHJhbnNsYXRlL2NvcmVcIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwiY3JlYXRlLXBvcnRmb2xpby1pdGVtXCIsXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2NyZWF0ZS1wb3J0Zm9saW8taXRlbS5jb21wb25lbnQuaHRtbFwiLFxufSlcbmV4cG9ydCBjbGFzcyBDcmVhdGVQb3J0Zm9saW9JdGVtQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICB0ZWNobmljYWxOYW1lOiBzdHJpbmc7XG4gICAgcXVhbnRpdHk6IG51bWJlcjtcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICAgIHN5bWJvbDogc3RyaW5nO1xuXG4gICAgcGxhdGZvcm1MaXN0OiBWYWx1ZUxpc3Q8c3RyaW5nPiA9IG5ldyBWYWx1ZUxpc3Q8c3RyaW5nPihbXG4gICAgICAgIHsgdmFsdWU6IFwiYml0c3RhbXBcIiwgZGlzcGxheTogXCJCaXRzdGFtcFwiIH0sXG4gICAgICAgIHsgdmFsdWU6IFwiYml0ZmluZXhcIiwgZGlzcGxheTogXCJCaXRmaW5leFwiIH1cbiAgICBdKTtcbiAgICBzZWxlY3RlZEluZGV4UGxhdGZvcm1MaXN0OiBudW1iZXIgPSB0aGlzLnBsYXRmb3JtTGlzdC5nZXRJbmRleChcImJpdHN0YW1wXCIpO1xuXG4gICAgcG9ydGZvbGlvOiBzdHJpbmcgPSB0aGlzLnBsYXRmb3JtTGlzdC5nZXRWYWx1ZSh0aGlzLnNlbGVjdGVkSW5kZXhQbGF0Zm9ybUxpc3QpO1xuXG4gICAgc2VsZWN0ZWRJbmRleEN1cnJlbmN5U3ltYm9sOiBudW1iZXI7XG4gICAgY3VycmVuY3lTeW1ib2xMaXN0OiBWYWx1ZUxpc3Q8c3RyaW5nPjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcG9ydGZvbGlvSXRlbVNlcnZpY2U6IFBvcnRmb2xpb0l0ZW1TZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSByb3V0ZXJFeHRlbnNpb246IFJvdXRlckV4dGVuc2lvbnMsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSBjdXJyZW5jeVByaWNlU2VydmljZTogQ3VycmVuY3lQcmljZVNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSB0cmFuc2xhdGVTZXJ2aWNlOiBUcmFuc2xhdGVTZXJ2aWNlKSB7IH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLmZpbGxTeW1ib2xzTGlzdChcImJpdHN0YW1wXCIpO1xuICAgIH1cblxuICAgIG9uQ3JlYXRlUG9ydGZvbGlvSXRlbSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRlc2NyaXB0aW9uIHx8XG4gICAgICAgICAgICAhdGhpcy5wb3J0Zm9saW8gfHxcbiAgICAgICAgICAgICF0aGlzLnN5bWJvbCB8fFxuICAgICAgICAgICAgIXRoaXMucXVhbnRpdHkgfHxcbiAgICAgICAgICAgICF0aGlzLnRlY2huaWNhbE5hbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuZ2V0KFwiZXJyb3JGaWxsSW5BbGxGaWVsZHNcIikuc3Vic2NyaWJlKCh0cmFuc2xhdGVkVGV4dCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBhbGVydCh0cmFuc2xhdGVkVGV4dCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLmNyZWF0ZVBvcnRmb2xpb0l0ZW0odGhpcy50ZWNobmljYWxOYW1lLCB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgIHRoaXMucXVhbnRpdHksIHRoaXMucG9ydGZvbGlvLCB0aGlzLnN5bWJvbCk7XG4gICAgICAgICAgICB0aGlzLnBvcnRmb2xpb0l0ZW1TZXJ2aWNlLnNhdmVQb3J0Zm9saW8oKTtcblxuICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb24uYmFjaygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25QbGF0Zm9ybUNoYW5nZShldmVudCkge1xuICAgICAgICB0aGlzLnBvcnRmb2xpbyA9IHRoaXMucGxhdGZvcm1MaXN0LmdldFZhbHVlKGV2ZW50Lm5ld0luZGV4KTtcbiAgICAgICAgdGhpcy5maWxsU3ltYm9sc0xpc3QodGhpcy5wb3J0Zm9saW8pO1xuICAgIH1cblxuICAgIG9uQ3VycmVuY3lTeW1ib2xDaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zeW1ib2wgPSB0aGlzLmN1cnJlbmN5U3ltYm9sTGlzdC5nZXRWYWx1ZShldmVudC5uZXdJbmRleCk7XG4gICAgfVxuXG5cbiAgICBwcml2YXRlIGZpbGxTeW1ib2xzTGlzdChwbGF0Zm9ybTogc3RyaW5nKSB7XG4gICAgICAgIGxldCBkaXN0aW5jdFN5bWJvbHMgPSB0aGlzLmN1cnJlbmN5UHJpY2VTZXJ2aWNlLmdldERpc3RpbmN0Q3VycmVuY3lTeW1ib2xzKHBsYXRmb3JtKTtcbiAgICAgICAgbGV0IG5ld1ZhbHVlTGlzdCA9IG5ldyBWYWx1ZUxpc3Q8c3RyaW5nPigpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGlzdGluY3RTeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbmV3VmFsdWVJdGVtID0geyB2YWx1ZTogZGlzdGluY3RTeW1ib2xzW2ldLCBkaXNwbGF5OiBkaXN0aW5jdFN5bWJvbHNbaV0gfTtcbiAgICAgICAgICAgIG5ld1ZhbHVlTGlzdC5wdXNoKG5ld1ZhbHVlSXRlbSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbmN5U3ltYm9sTGlzdCA9IG5ld1ZhbHVlTGlzdDtcbiAgICB9XG59Il19