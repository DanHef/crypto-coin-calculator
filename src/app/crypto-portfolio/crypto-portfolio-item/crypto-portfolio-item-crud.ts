import { ICryptoPortfolioItem } from './crypto-portfolio-item';
import { CRUDOperation } from '../../shared/crud-operation.enum';

export interface ICryptoPortfolioItemCRUD {
    item: ICryptoPortfolioItem;
    operation: CRUDOperation;
}