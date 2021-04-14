import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ICryptoPortfolioItem } from './crypto-portfolio-item';
import { ICryptoPortfolioItemChanged } from './crypto-portfolio-item-changed';


@Component({
    selector: 'crypto-portfolio-item',
    templateUrl: './crypto-portfolio-item.component.html',
    styleUrls: ['./crypto-portfolio-item.component.css']
})
export class CryptoPortfolioItemComponent implements OnInit {
    private _cryptoPortfolioItem: ICryptoPortfolioItem;
    quantity: number;

    @Input() set cryptoPortfolioItem(item: ICryptoPortfolioItem) {
        this._cryptoPortfolioItem = item;
        this.quantity = this._cryptoPortfolioItem.quantity;
    };
    get cryptoPortfolioItem() {
        return this._cryptoPortfolioItem;
    }

    @Output() quantityChanged = new EventEmitter<ICryptoPortfolioItemChanged>();
    @Output() deleted = new EventEmitter<number>();

    constructor() { }

    ngOnInit(): void { }

    public onDelete(): void {
        console.log(`Delete pressed on item ${this.cryptoPortfolioItem.id}`);
        this.deleted.emit(this.cryptoPortfolioItem.id);
    }

    public onQuantityChanged(newQuantity): void {
        this.quantityChanged.emit({
            id: this.cryptoPortfolioItem.id,
            quantity: this.quantity,
            item: this.cryptoPortfolioItem
        });
    }
}
