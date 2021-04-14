import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICryptoPortfolioItem } from './crypto-portfolio-item';

interface ICryptoPortfolioItemQuantityChanged {
    id: number;
    quantity: number;
}

@Component({
    selector: 'crypto-portfolio-item',
    templateUrl: './crypto-portfolio-item.component.html',
    styleUrls: ['./crypto-portfolio-item.component.css']
})
export class CryptoPortfolioItemComponent implements OnInit {

    @Input() cryptoPortfolioItem: ICryptoPortfolioItem;
    @Output() quantityChanged = new EventEmitter<ICryptoPortfolioItemQuantityChanged>();
    @Output() deleted = new EventEmitter<number>();

    constructor() { }

    ngOnInit(): void { }

    public onDelete(): void {
        console.log(`Delete pressed on item ${this.cryptoPortfolioItem.id}`);
        this.deleted.emit(this.cryptoPortfolioItem.id);
    }

    public onQuantityChanged(newQuantity): void {
        console.log(`Portfolio Item Quantity Changed to: ${newQuantity} for item ${this.cryptoPortfolioItem.id}`);

        this.cryptoPortfolioItem.quantity = newQuantity;
        this.quantityChanged.emit({id: this.cryptoPortfolioItem.id, quantity: this.cryptoPortfolioItem.quantity} );
    }
}
