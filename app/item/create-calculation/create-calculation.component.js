"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var calculation_service_1 = require("../services/calculation.service");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var CreateCalculationComponent = (function () {
    function CreateCalculationComponent(calculationService, router, routerExtension) {
        this.calculationService = calculationService;
        this.router = router;
        this.routerExtension = routerExtension;
    }
    CreateCalculationComponent.prototype.createCalculationResult = function () {
        this.calculationService.createCalculationResult(this.sourcePortfolioItemName.toLowerCase(), this.targetCurrencySymbol.toLowerCase(), this.description, this.platform.toLowerCase());
        this.routerExtension.back();
    };
    CreateCalculationComponent = __decorate([
        core_1.Component({
            selector: "create-calculation",
            moduleId: module.id,
            templateUrl: "./create-calculation.component.html",
        }),
        __metadata("design:paramtypes", [calculation_service_1.CalculationService,
            router_1.Router,
            router_2.RouterExtensions])
    ], CreateCalculationComponent);
    return CreateCalculationComponent;
}());
exports.CreateCalculationComponent = CreateCalculationComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWNhbGN1bGF0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyZWF0ZS1jYWxjdWxhdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFFbEQsdUVBQXFFO0FBRXJFLDBDQUF5QztBQUN6QyxzREFBK0Q7QUFPL0Q7SUFNSSxvQ0FBNkIsa0JBQXNDLEVBQ3RDLE1BQWMsRUFDZCxlQUFpQztRQUZqQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxvQkFBZSxHQUFmLGVBQWUsQ0FBa0I7SUFBSSxDQUFDO0lBRW5FLDREQUF1QixHQUF2QjtRQUNJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFdBQVcsRUFBRSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBRXBMLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDaEMsQ0FBQztJQWRRLDBCQUEwQjtRQUx0QyxnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLG9CQUFvQjtZQUM5QixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsV0FBVyxFQUFFLHFDQUFxQztTQUNyRCxDQUFDO3lDQU9tRCx3Q0FBa0I7WUFDOUIsZUFBTTtZQUNHLHlCQUFnQjtPQVJyRCwwQkFBMEIsQ0FldEM7SUFBRCxpQ0FBQztDQUFBLEFBZkQsSUFlQztBQWZZLGdFQUEwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcblxuaW1wb3J0IHsgQ2FsY3VsYXRpb25TZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL2NhbGN1bGF0aW9uLnNlcnZpY2VcIjtcblxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwiY3JlYXRlLWNhbGN1bGF0aW9uXCIsXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2NyZWF0ZS1jYWxjdWxhdGlvbi5jb21wb25lbnQuaHRtbFwiLFxufSlcbmV4cG9ydCBjbGFzcyBDcmVhdGVDYWxjdWxhdGlvbkNvbXBvbmVudCAge1xuICAgIHNvdXJjZVBvcnRmb2xpb0l0ZW1OYW1lOiBzdHJpbmc7XG4gICAgdGFyZ2V0Q3VycmVuY3lTeW1ib2w6c3RyaW5nO1xuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gICAgcGxhdGZvcm06IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY2FsY3VsYXRpb25TZXJ2aWNlOiBDYWxjdWxhdGlvblNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSByb3V0ZXI6IFJvdXRlcixcbiAgICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHJvdXRlckV4dGVuc2lvbjogUm91dGVyRXh0ZW5zaW9ucykgeyB9XG5cbiAgICBjcmVhdGVDYWxjdWxhdGlvblJlc3VsdCgpIHtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGlvblNlcnZpY2UuY3JlYXRlQ2FsY3VsYXRpb25SZXN1bHQodGhpcy5zb3VyY2VQb3J0Zm9saW9JdGVtTmFtZS50b0xvd2VyQ2FzZSgpLCB0aGlzLnRhcmdldEN1cnJlbmN5U3ltYm9sLnRvTG93ZXJDYXNlKCksIHRoaXMuZGVzY3JpcHRpb24sIHRoaXMucGxhdGZvcm0udG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbi5iYWNrKCk7XG4gICAgfVxufSJdfQ==