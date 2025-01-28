import { ProductsService } from '@services/productsService';
import { Product } from '@database/index';
import { HttpException } from '@exceptions/httpException';
import { Inject, Service } from 'typedi';

interface IncreaseProductAmountCommandPayload {
  productId: string;
  amount: number;
}

interface IncreaseProductAmountCommandResult {
  data: Product;
}

@Service()
export class IncreaseProductAmountCommand {
  productsService: ProductsService;

  constructor(@Inject() productsService: ProductsService) {
    this.productsService = productsService;
  }

  async execute(
    payload: IncreaseProductAmountCommandPayload,
  ): Promise<IncreaseProductAmountCommandResult> {
    const { productId, amount } = payload;

    const product = await this.productsService.findOneById(productId);

    if (!product) {
      throw new HttpException(404, `Product with id: ${productId} not found.`);
    }

    const updatedProduct = await this.productsService.changeProductStock(
      productId,
      product.stock + amount,
    );

    return { data: updatedProduct };
  }
}
