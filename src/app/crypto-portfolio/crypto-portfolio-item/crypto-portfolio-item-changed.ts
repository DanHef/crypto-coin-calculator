import { ICryptoPortfolioItem } from './crypto-portfolio-item';

export interface ICryptoPortfolioItemChanged {
    id: number;
    quantity: number;
    item: ICryptoPortfolioItem;
}