import { NextFunction, Request, Response, Router } from 'express';

import { Routes } from '@interfaces/routesInterface';
import { CreateOrderCommand } from '@commands/createOrderCommand';
import Container from 'typedi';
import { ValidationMiddleware } from '@middlewares/validationMiddleware';
import { CreateOrderDTO } from '@dtos/createOrderDto';

export class OrdersRoutes implements Routes {
  public path = '/orders';
  public router = Router();

  public createOrderCommand: CreateOrderCommand;

  constructor() {
    this.loadRoutes();

    this.createOrderCommand = Container.get(CreateOrderCommand);
  }

  private loadRoutes() {
    this.router.post(
      this.path,
      ValidationMiddleware(CreateOrderDTO),
      this.createOrder.bind(this),
    );
  }

  private async createOrder(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const { customerId, productsList } = request.body;
    try {
      const { data } = await this.createOrderCommand.execute({
        customerId,
        productsList,
      });

      response.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }
}
