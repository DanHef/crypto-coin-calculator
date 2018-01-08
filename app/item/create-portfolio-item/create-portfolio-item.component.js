"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var portfolio_item_service_1 = require("../services/portfolio-item.service");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var nativescript_drop_down_1 = require("nativescript-drop-down");
var currency_price_service_1 = require("../services/currency-price.service");
var CreatePortfolioItemComponent = (function () {
    function CreatePortfolioItemComponent(portfolioItemService, router, routerExtension, currencyPriceService) {
        this.portfolioItemService = portfolioItemService;
        this.router = router;
        this.routerExtension = routerExtension;
        this.currencyPriceService = currencyPriceService;
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
            alert("Bitte alle Felder ausfüllen");
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
            currency_price_service_1.CurrencyPriceService])
    ], CreatePortfolioItemComponent);
    return CreatePortfolioItemComponent;
}());
exports.CreatePortfolioItemComponent = CreatePortfolioItemComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXBvcnRmb2xpby1pdGVtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyZWF0ZS1wb3J0Zm9saW8taXRlbS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFHbEQsNkVBQTBFO0FBRTFFLDBDQUF5QztBQUN6QyxzREFBK0Q7QUFFL0QsaUVBQW1EO0FBRW5ELDZFQUEwRTtBQU8xRTtJQWlCSSxzQ0FBNkIsb0JBQTBDLEVBQ2xELE1BQWMsRUFDZCxlQUFpQyxFQUNqQyxvQkFBMEM7UUFIbEMseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUNsRCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2Qsb0JBQWUsR0FBZixlQUFlLENBQWtCO1FBQ2pDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFkL0QsaUJBQVksR0FBc0IsSUFBSSxrQ0FBUyxDQUFTO1lBQ3BELEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFO1lBQzFDLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFO1NBQzdDLENBQUMsQ0FBQztRQUNILDhCQUF5QixHQUFXLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTNFLGNBQVMsR0FBVyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQVFaLENBQUM7SUFFcEUsK0NBQVEsR0FBUjtRQUNJLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELDREQUFxQixHQUFyQjtRQUNJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVc7WUFDakIsQ0FBQyxJQUFJLENBQUMsU0FBUztZQUNmLENBQUMsSUFBSSxDQUFDLE1BQU07WUFDWixDQUFDLElBQUksQ0FBQyxRQUFRO1lBQ2QsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUN0QixLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsb0JBQW9CLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUM5RSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUUxQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2hDLENBQUM7SUFDTCxDQUFDO0lBRUQsdURBQWdCLEdBQWhCLFVBQWlCLEtBQUs7UUFDbEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELDZEQUFzQixHQUF0QixVQUF1QixLQUFLO1FBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUdPLHNEQUFlLEdBQXZCLFVBQXdCLFFBQWdCO1FBQ3BDLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyRixJQUFJLFlBQVksR0FBRyxJQUFJLGtDQUFTLEVBQVUsQ0FBQztRQUUzQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUM5QyxJQUFJLFlBQVksR0FBRyxFQUFFLEtBQUssRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQzlFLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUVELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxZQUFZLENBQUM7SUFDM0MsQ0FBQztJQTlEUSw0QkFBNEI7UUFMeEMsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSx1QkFBdUI7WUFDakMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSx3Q0FBd0M7U0FDeEQsQ0FBQzt5Q0FrQnFELDZDQUFvQjtZQUMxQyxlQUFNO1lBQ0cseUJBQWdCO1lBQ1gsNkNBQW9CO09BcEJ0RCw0QkFBNEIsQ0ErRHhDO0lBQUQsbUNBQUM7Q0FBQSxBQS9ERCxJQStEQztBQS9EWSxvRUFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBDb2luUG9ydGZvbGlvSXRlbSB9IGZyb20gXCIuLi9Db2luUG9ydGZvbGlvSXRlbVwiO1xuXG5pbXBvcnQgeyBQb3J0Zm9saW9JdGVtU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9wb3J0Zm9saW8taXRlbS5zZXJ2aWNlXCI7XG5cbmltcG9ydCB7IFJvdXRlciB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5cbmltcG9ydCB7IFZhbHVlTGlzdCB9IGZyb20gXCJuYXRpdmVzY3JpcHQtZHJvcC1kb3duXCI7XG5cbmltcG9ydCB7IEN1cnJlbmN5UHJpY2VTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL2N1cnJlbmN5LXByaWNlLnNlcnZpY2VcIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwiY3JlYXRlLXBvcnRmb2xpby1pdGVtXCIsXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2NyZWF0ZS1wb3J0Zm9saW8taXRlbS5jb21wb25lbnQuaHRtbFwiLFxufSlcbmV4cG9ydCBjbGFzcyBDcmVhdGVQb3J0Zm9saW9JdGVtQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICB0ZWNobmljYWxOYW1lOiBzdHJpbmc7XG4gICAgcXVhbnRpdHk6IG51bWJlcjtcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICAgIHN5bWJvbDogc3RyaW5nO1xuXG4gICAgcGxhdGZvcm1MaXN0OiBWYWx1ZUxpc3Q8c3RyaW5nPiA9IG5ldyBWYWx1ZUxpc3Q8c3RyaW5nPihbXG4gICAgICAgIHsgdmFsdWU6IFwiYml0c3RhbXBcIiwgZGlzcGxheTogXCJCaXRzdGFtcFwiIH0sXG4gICAgICAgIHsgdmFsdWU6IFwiYml0ZmluZXhcIiwgZGlzcGxheTogXCJCaXRmaW5leFwiIH1cbiAgICBdKTtcbiAgICBzZWxlY3RlZEluZGV4UGxhdGZvcm1MaXN0OiBudW1iZXIgPSB0aGlzLnBsYXRmb3JtTGlzdC5nZXRJbmRleChcImJpdHN0YW1wXCIpO1xuXG4gICAgcG9ydGZvbGlvOiBzdHJpbmcgPSB0aGlzLnBsYXRmb3JtTGlzdC5nZXRWYWx1ZSh0aGlzLnNlbGVjdGVkSW5kZXhQbGF0Zm9ybUxpc3QpO1xuXG4gICAgc2VsZWN0ZWRJbmRleEN1cnJlbmN5U3ltYm9sOiBudW1iZXI7XG4gICAgY3VycmVuY3lTeW1ib2xMaXN0OiBWYWx1ZUxpc3Q8c3RyaW5nPjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcG9ydGZvbGlvSXRlbVNlcnZpY2U6IFBvcnRmb2xpb0l0ZW1TZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHJvdXRlcjogUm91dGVyLFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHJvdXRlckV4dGVuc2lvbjogUm91dGVyRXh0ZW5zaW9ucyxcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBjdXJyZW5jeVByaWNlU2VydmljZTogQ3VycmVuY3lQcmljZVNlcnZpY2UpIHsgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuZmlsbFN5bWJvbHNMaXN0KFwiYml0c3RhbXBcIik7XG4gICAgfVxuXG4gICAgb25DcmVhdGVQb3J0Zm9saW9JdGVtKCkge1xuICAgICAgICBpZiAoIXRoaXMuZGVzY3JpcHRpb24gfHxcbiAgICAgICAgICAgICF0aGlzLnBvcnRmb2xpbyB8fFxuICAgICAgICAgICAgIXRoaXMuc3ltYm9sIHx8XG4gICAgICAgICAgICAhdGhpcy5xdWFudGl0eSB8fFxuICAgICAgICAgICAgIXRoaXMudGVjaG5pY2FsTmFtZSkge1xuICAgICAgICAgICAgYWxlcnQoXCJCaXR0ZSBhbGxlIEZlbGRlciBhdXNmw7xsbGVuXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5jcmVhdGVQb3J0Zm9saW9JdGVtKHRoaXMudGVjaG5pY2FsTmFtZSwgdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICB0aGlzLnF1YW50aXR5LCB0aGlzLnBvcnRmb2xpbywgdGhpcy5zeW1ib2wpO1xuICAgICAgICAgICAgdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5zYXZlUG9ydGZvbGlvKCk7XG5cbiAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9uLmJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uUGxhdGZvcm1DaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5wb3J0Zm9saW8gPSB0aGlzLnBsYXRmb3JtTGlzdC5nZXRWYWx1ZShldmVudC5uZXdJbmRleCk7XG4gICAgICAgIHRoaXMuZmlsbFN5bWJvbHNMaXN0KHRoaXMucG9ydGZvbGlvKTtcbiAgICB9XG5cbiAgICBvbkN1cnJlbmN5U3ltYm9sQ2hhbmdlKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc3ltYm9sID0gdGhpcy5jdXJyZW5jeVN5bWJvbExpc3QuZ2V0VmFsdWUoZXZlbnQubmV3SW5kZXgpO1xuICAgIH1cblxuXG4gICAgcHJpdmF0ZSBmaWxsU3ltYm9sc0xpc3QocGxhdGZvcm06IHN0cmluZykge1xuICAgICAgICBsZXQgZGlzdGluY3RTeW1ib2xzID0gdGhpcy5jdXJyZW5jeVByaWNlU2VydmljZS5nZXREaXN0aW5jdEN1cnJlbmN5U3ltYm9scyhwbGF0Zm9ybSk7XG4gICAgICAgIGxldCBuZXdWYWx1ZUxpc3QgPSBuZXcgVmFsdWVMaXN0PHN0cmluZz4oKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRpc3RpbmN0U3ltYm9scy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IG5ld1ZhbHVlSXRlbSA9IHsgdmFsdWU6IGRpc3RpbmN0U3ltYm9sc1tpXSwgZGlzcGxheTogZGlzdGluY3RTeW1ib2xzW2ldIH07XG4gICAgICAgICAgICBuZXdWYWx1ZUxpc3QucHVzaChuZXdWYWx1ZUl0ZW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdXJyZW5jeVN5bWJvbExpc3QgPSBuZXdWYWx1ZUxpc3Q7XG4gICAgfVxufSJdfQ==