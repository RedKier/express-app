import { DatabaseSchema, db, LowWithLodash, Product } from '@database/index';
import { Service } from 'typedi';
import { v4 as uuidv4 } from 'uuid';

@Service()
export class ProductsService {
  public db: LowWithLodash<DatabaseSchema>;

  constructor() {
    this.db = db;
  }

  async getAll(): Promise<Product[]> {
    const products = await db.chain.get('products').value();

    return products;
  }

  async findManyByIds(ids: string[]): Promise<Product[]> {
    const products = await db.chain
      .get('products')
      .filter((product) => ids.includes(product.id))
      .value();

    return products;
  }

  async create(
    name: string,
    description: string,
    price: number,
    stock: number,
  ): Promise<Product> {
    const id = uuidv4();

    await db.update(({ products }) =>
      products.push({ id, name, description, price, stock }),
    );

    const product = await db.chain.get('products').find({ id }).value();

    return product;
  }

  async findOneById(id: string): Promise<Product | undefined> {
    const product = await db.chain.get('products').find({ id }).value();

    return product;
  }

  async changeProductStock(id: string, amount: number): Promise<Product> {
    const product = await db.chain
      .get('products')
      .find({ id: id })
      .assign({ stock: amount })
      .value();

    await db.write();

    return product;
  }
}
