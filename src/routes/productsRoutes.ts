import { NextFunction, Request, Response, Router } from 'express';

import { Routes } from '@interfaces/routesInterface';
import { ValidationMiddleware } from '@middlewares/validationMiddleware';
import { createProductDTO } from '@dtos/createProductDto';
import { CreateProductCommand } from '@commands/createProductCommand';
import { GetProductsQuery } from '@queries/getProductsQuery';
import { IncreaseProductAmountDTO } from '@dtos/increaseProductAmountDto';
import { DecreaseProductAmountDTO } from '@dtos/decreaseProductAmountDto';
import { DecreaseProductAmountCommand } from '@commands/decreaseProductAmountCommand';
import { IncreaseProductAmountCommand } from '@commands/increaseProductAmountCommand';
import Container from 'typedi';

export class ProdutsRoutes implements Routes {
  public path = '/products';
  public router = Router();

  public increaseProductAmountCommand: IncreaseProductAmountCommand;
  public decreaseProductAmountCommand: DecreaseProductAmountCommand;
  public createProductCommand: CreateProductCommand;
  public getProductsQuery: GetProductsQuery;

  constructor() {
    this.loadRoutes();

    this.increaseProductAmountCommand = Container.get(
      IncreaseProductAmountCommand,
    );
    this.decreaseProductAmountCommand = Container.get(
      DecreaseProductAmountCommand,
    );
    this.createProductCommand = Container.get(CreateProductCommand);
    this.getProductsQuery = Container.get(GetProductsQuery);
  }

  private loadRoutes() {
    this.router.get(this.path, this.getProducts.bind(this));

    this.router.post(
      this.path,
      ValidationMiddleware(createProductDTO),
      this.createProduct.bind(this),
    );

    this.router.post(
      `${this.path}/:id/restock`,
      ValidationMiddleware(IncreaseProductAmountDTO),
      this.restockProduct.bind(this),
    );

    this.router.post(
      `${this.path}/:id/sell`,
      ValidationMiddleware(DecreaseProductAmountDTO),
      this.sellProduct.bind(this),
    );
  }

  private async getProducts(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { data } = await this.getProductsQuery.execute();

      response.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  private async createProduct(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const { name, description, price, stock } = request.body;

    try {
      const { data } = await this.createProductCommand.execute({
        name,
        description,
        price,
        stock,
      });

      response.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  private async restockProduct(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const { productId, amount } = request.body;

    try {
      const { data } = await this.increaseProductAmountCommand.execute({
        productId,
        amount,
      });

      response.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  private async sellProduct(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const { productId, amount } = request.body;

    try {
      const { data } = await this.decreaseProductAmountCommand.execute({
        productId,
        amount,
      });

      response.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }
}
