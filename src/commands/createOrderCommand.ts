import { Inject, Service } from 'typedi';

import { Order, ProductListItem } from '@database/index';
import { HttpException } from '@exceptions/httpException';
import { ProductsService } from '@services/productsService';
import { CustomersService } from '@services/customersService';
import { OrdersService } from '@services/ordersService';

interface CreateOrderCommandPayload {
  customerId: string;
  productsList: ProductListItem[];
}

interface CreateOrderCommandResult {
  data: Order;
}

@Service()
export class CreateOrderCommand {
  productsService: ProductsService;
  customersService: CustomersService;
  ordersService: OrdersService;

  constructor(
    @Inject()
    productsService: ProductsService,
    @Inject()
    customersService: CustomersService,
    @Inject()
    ordersService: OrdersService,
  ) {
    this.productsService = productsService;
    this.customersService = customersService;
    this.ordersService = ordersService;
  }

  async execute(
    payload: CreateOrderCommandPayload,
  ): Promise<CreateOrderCommandResult> {
    const { customerId, productsList } = payload;

    const customer = await this.customersService.findOneById(customerId);

    if (!customer) {
      throw new HttpException(
        404,
        `Customer with id: ${customerId} not found.`,
      );
    }

    const productIds = productsList.map((item) => item.productId);

    const products = await this.productsService.findManyByIds(productIds);

    // ugh🤢
    if (productIds.length !== products.length) {
      throw new HttpException(
        400,
        `Order has products not listed in inventory.`,
      );
    }

    // ugh🤢🤢
    // this should be transaction as whole but as far as I can see lowdb have none
    // at this point I don't have enough time to find solution or replace lowdb in code
    const updatedProductsList: ProductListItem[] = [];

    products.forEach((product) => {
      const selectedItem = productsList.find(
        (item) => item.productId === product.id,
      );

      if (selectedItem.amount > product.stock) {
        throw new HttpException(
          400,
          `Product with id ${selectedItem.productId} has insufficient stock.`,
        );
      }

      updatedProductsList.push({
        productId: selectedItem.productId,
        amount: product.stock - selectedItem.amount,
      });
    });

    for await (const item of updatedProductsList) {
      await this.productsService.changeProductStock(
        item.productId,
        item.amount,
      );
    }

    const order = await this.ordersService.create(customerId, productsList);

    return { data: order };
  }
}
