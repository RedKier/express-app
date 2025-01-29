import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import lodash from 'lodash';
import path from 'node:path';

export type Customer = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
};

export type ProductListItem = {
  productId: string;
  amount: number;
};

export type Order = {
  id: string;
  customerId: string;
  productsList: ProductListItem[];
};

export type DatabaseSchema = {
  customers: Customer[];
  products: Product[];
  orders: Order[];
};

const defaultData: DatabaseSchema = {
  customers: [{ id: '8062741b-41e6-4c8e-857a-331f0274c17f', name: 'John Doe' }],
  products: [
    {
      id: '503810b2-6cf1-45ad-8447-143ddae91139',
      name: 'first',
      description: 'first product',
      price: 2000,
      stock: 5,
    },
    {
      id: '4c18e80a-7ba1-4e8d-a63d-4a6c271aebf6',
      name: 'second',
      description: 'second product',
      price: 3000,
      stock: 2,
    },
  ],
  orders: [],
};

export class LowWithLodash<T> extends LowSync<T> {
  chain: lodash.ExpChain<this['data']> = lodash.chain(this).get('data');
}

const pathToDoc = path.join(__dirname, '../../db.json');

const adapter = new JSONFileSync<DatabaseSchema>(pathToDoc);

export const db = new LowWithLodash(adapter, defaultData);

db.write();
