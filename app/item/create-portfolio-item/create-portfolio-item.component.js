"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var portfolio_item_service_1 = require("../services/portfolio-item.service");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var CreatePortfolioItemComponent = (function () {
    function CreatePortfolioItemComponent(portfolioItemService, router, routerExtension) {
        this.portfolioItemService = portfolioItemService;
        this.router = router;
        this.routerExtension = routerExtension;
    }
    CreatePortfolioItemComponent.prototype.onCreatePortfolioItem = function () {
        this.portfolioItemService.createPortfolioItem(this.technicalName, this.description, this.quantity, this.portfolio, this.symbol);
        this.portfolioItemService.savePortfolio();
        this.routerExtension.back();
    };
    CreatePortfolioItemComponent = __decorate([
        core_1.Component({
            selector: "create-portfolio-item",
            moduleId: module.id,
            templateUrl: "./create-portfolio-item.component.html",
        }),
        __metadata("design:paramtypes", [portfolio_item_service_1.PortfolioItemService,
            router_1.Router,
            router_2.RouterExtensions])
    ], CreatePortfolioItemComponent);
    return CreatePortfolioItemComponent;
}());
exports.CreatePortfolioItemComponent = CreatePortfolioItemComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXBvcnRmb2xpby1pdGVtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyZWF0ZS1wb3J0Zm9saW8taXRlbS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMEM7QUFHMUMsNkVBQTBFO0FBRTFFLDBDQUF5QztBQUN6QyxzREFBK0Q7QUFPL0Q7SUFPSSxzQ0FBNkIsb0JBQTBDLEVBQ2xELE1BQWMsRUFDZCxlQUFpQztRQUZ6Qix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQ2xELFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxvQkFBZSxHQUFmLGVBQWUsQ0FBa0I7SUFBSSxDQUFDO0lBRTNELDREQUFxQixHQUFyQjtRQUNJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQzlFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRTFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDaEMsQ0FBQztJQWpCUSw0QkFBNEI7UUFMeEMsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSx1QkFBdUI7WUFDakMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSx3Q0FBd0M7U0FDeEQsQ0FBQzt5Q0FRcUQsNkNBQW9CO1lBQzFDLGVBQU07WUFDRyx5QkFBZ0I7T0FUN0MsNEJBQTRCLENBa0J4QztJQUFELG1DQUFDO0NBQUEsQUFsQkQsSUFrQkM7QUFsQlksb0VBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IENvaW5Qb3J0Zm9saW9JdGVtIH0gZnJvbSBcIi4uL0NvaW5Qb3J0Zm9saW9JdGVtXCI7XG5cbmltcG9ydCB7IFBvcnRmb2xpb0l0ZW1TZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL3BvcnRmb2xpby1pdGVtLnNlcnZpY2VcIjtcblxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwiY3JlYXRlLXBvcnRmb2xpby1pdGVtXCIsXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2NyZWF0ZS1wb3J0Zm9saW8taXRlbS5jb21wb25lbnQuaHRtbFwiLFxufSlcbmV4cG9ydCBjbGFzcyBDcmVhdGVQb3J0Zm9saW9JdGVtQ29tcG9uZW50IHtcbiAgICB0ZWNobmljYWxOYW1lOiBzdHJpbmc7XG4gICAgcXVhbnRpdHk6IG51bWJlcjtcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICAgIHBvcnRmb2xpbzogc3RyaW5nO1xuICAgIHN5bWJvbDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwb3J0Zm9saW9JdGVtU2VydmljZTogUG9ydGZvbGlvSXRlbVNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgcm91dGVyRXh0ZW5zaW9uOiBSb3V0ZXJFeHRlbnNpb25zKSB7IH1cblxuICAgIG9uQ3JlYXRlUG9ydGZvbGlvSXRlbSgpIHtcbiAgICAgICAgdGhpcy5wb3J0Zm9saW9JdGVtU2VydmljZS5jcmVhdGVQb3J0Zm9saW9JdGVtKHRoaXMudGVjaG5pY2FsTmFtZSwgdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIHRoaXMucXVhbnRpdHksIHRoaXMucG9ydGZvbGlvLCB0aGlzLnN5bWJvbCk7XG4gICAgICAgIHRoaXMucG9ydGZvbGlvSXRlbVNlcnZpY2Uuc2F2ZVBvcnRmb2xpbygpO1xuXG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9uLmJhY2soKTtcbiAgICB9XG59Il19