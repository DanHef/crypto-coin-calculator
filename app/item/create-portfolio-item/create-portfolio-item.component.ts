import { Component, OnInit, ViewChild, AfterViewInit, ViewContainerRef } from "@angular/core";
import { CoinPortfolioItem } from "../CoinPortfolioItem";

import { PortfolioItemService } from "../services/portfolio-item.service";

import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "create-portfolio-item",
    moduleId: module.id,
    templateUrl: "./create-portfolio-item.component.html",
})
export class CreatePortfolioItemComponent  {
    technicalName: string;
    quantity: number;
    description: string;
    portfolio: string;
    symbol: string;

    constructor(private readonly portfolioItemService: PortfolioItemService,
                private readonly router: Router,
                private readonly routerExtension: RouterExtensions) { }

    onCreatePortfolioItem() {
        this.portfolioItemService.createPortfolioItem(this.technicalName, this.description, 
                                                        this.quantity, this.portfolio, this.symbol);

        this.routerExtension.navigate(["/items"], { clearHistory: true });
    }
}