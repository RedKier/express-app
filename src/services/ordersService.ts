import {
  DatabaseSchema,
  db,
  LowWithLodash,
  Order,
  ProductListItem,
} from '@database/index';
import { Service } from 'typedi';
import { v4 as uuidv4 } from 'uuid';

@Service()
export class OrdersService {
  public db: LowWithLodash<DatabaseSchema>;

  constructor() {
    this.db = db;
  }

  async create(
    customerId: string,
    productsList: ProductListItem[],
  ): Promise<Order> {
    const id = uuidv4();

    await db.update(({ orders }) =>
      orders.push({ id, customerId, productsList }),
    );

    const order = await db.chain.get('orders').find({ id }).value();

    return order;
  }
}
