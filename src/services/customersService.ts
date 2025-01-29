import { DatabaseSchema, db, LowWithLodash, Customer } from '@database/index';
import { Service } from 'typedi';

@Service()
export class CustomersService {
  public db: LowWithLodash<DatabaseSchema>;

  constructor() {
    this.db = db;
  }

  async findOneById(id: string): Promise<Customer | undefined> {
    const customer = await db.chain.get('customers').find({ id }).value();

    return customer;
  }
}
