import { NextFunction, Request, Response, Router } from 'express';

import { Routes } from '@interfaces/routesInterface';
import { validationMiddleware } from '@middlewares/validationMiddleware';
import { CreateProductCommand } from '@commands/createProductCommand';
import { GetProductsQuery } from '@queries/getProductsQuery';
import { DecreaseProductAmountCommand } from '@commands/decreaseProductAmountCommand';
import { IncreaseProductAmountCommand } from '@commands/increaseProductAmountCommand';
import Container from 'typedi';
import { createProductValidationSchema } from '@validationSchemas/createProductValidationSchema';
import { decreaseProductAmountValidationSchema } from '@validationSchemas/decreaseProductAmountValidationSchema';
import { increaseProductAmountValidationSchema } from '@validationSchemas/increaseProductAmountValidationSchema';

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
      validationMiddleware(createProductValidationSchema),
      this.createProduct.bind(this),
    );

    this.router.post(
      `${this.path}/:id/restock`,
      validationMiddleware(increaseProductAmountValidationSchema),
      this.restockProduct.bind(this),
    );

    this.router.post(
      `${this.path}/:id/sell`,
      validationMiddleware(decreaseProductAmountValidationSchema),
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
    const { id } = request.params;
    const { amount } = request.body;

    try {
      const { data } = await this.increaseProductAmountCommand.execute({
        id,
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
    const { id } = request.params;
    const { amount } = request.body;

    try {
      const { data } = await this.decreaseProductAmountCommand.execute({
        id,
        amount,
      });

      response.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }
}
