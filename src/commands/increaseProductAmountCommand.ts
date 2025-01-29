import { ProductsService } from '@services/productsService';
import { Product } from '@database/index';
import { HttpException } from '@exceptions/httpException';
import { Inject, Service } from 'typedi';

interface IncreaseProductAmountCommandPayload {
  id: string;
  amount: number;
}

interface IncreaseProductAmountCommandResult {
  data: Product;
}

@Service()
export class IncreaseProductAmountCommand {
  constructor(
    @Inject()
    public readonly productsService: ProductsService,
  ) {}

  async execute(
    payload: IncreaseProductAmountCommandPayload,
  ): Promise<IncreaseProductAmountCommandResult> {
    const { id, amount } = payload;

    const product = await this.productsService.findOneById(id);

    if (!product) {
      throw new HttpException(404, `Product with id: ${id} not found.`);
    }

    const updatedProduct = await this.productsService.changeProductStock(
      id,
      product.stock + amount,
    );

    return { data: updatedProduct };
  }
}
