import { HttpException } from '@exceptions/httpException';
import { Product } from '@database/index';
import { Inject, Service } from 'typedi';
import { ProductsService } from '@services/productsService';

interface DecreaseProductAmountCommandPayload {
  id: string;
  amount: number;
}

interface DecreaseProductAmountCommandResult {
  data: Product;
}

@Service()
export class DecreaseProductAmountCommand {
  productsService: ProductsService;

  constructor(@Inject() productsService: ProductsService) {
    this.productsService = productsService;
  }

  async execute(
    payload: DecreaseProductAmountCommandPayload,
  ): Promise<DecreaseProductAmountCommandResult> {
    const { id, amount } = payload;

    const product = await this.productsService.findOneById(id);

    if (!product) {
      throw new HttpException(404, `Product with id: ${id} not found.`);
    }

    if (product.stock < amount) {
      throw new HttpException(400, `Product stock can't be decreased below 0.`);
    }

    const updatedProduct = await this.productsService.changeProductStock(
      id,
      product.stock - amount,
    );

    return { data: updatedProduct };
  }
}
