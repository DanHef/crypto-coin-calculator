import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CryptoPlatform } from 'src/app/crypto-platform/crypto-platform.enum';
import { CryptoPortfolioService } from '../../crypto-portfolio.service';
import { CryptoPortfolioItem } from '../crypto-portfolio-item';

@Component({
    selector: 'ns-create-crypto-portfolio-item',
    templateUrl: './create-crypto-portfolio-item.component.html',
    styleUrls: ['./create-crypto-portfolio-item.component.css']
})
export class CreateCryptoPortfolioItemComponent implements OnInit {
    platforms: Array<string> = ["Bitstamp", "Bitfinex"];
    selectedPlatform = "";
    name = "";
    currencyCode = "";
    quantity = 1;

    showPlatformPicker = false;

    constructor(private readonly cryptoPortfolioService: CryptoPortfolioService,
        private readonly router: Router) { }

    ngOnInit(): void {
    }

    public onPlatformSelectionChanged(event) {
        this.selectedPlatform = event.value;

    }

    public onPlatformSelect() {
        this.showPlatformPicker = true;
    }

    public confirmSelectedPlatform() {
        this.showPlatformPicker = false;
    }

    public onItemCreate() {
        const newPortfolioItem = new CryptoPortfolioItem(this.name.toLowerCase(),
                                                            this.quantity,
                                                            this.selectedPlatform.toLowerCase() as CryptoPlatform,
                                                            this.currencyCode.toLowerCase());
        this.cryptoPortfolioService.addCryptoPortfolioItem(newPortfolioItem);

        this.router.navigate(['crypto-home']);
    }

    public onCancel() {
        this.initializeFields();
        this.router.navigate(['crypto-home']);
    }

    private initializeFields() {
        this.selectedPlatform = "";
        this.currencyCode = "";
        this.name = "";
        this.quantity = 0;
    }

}
