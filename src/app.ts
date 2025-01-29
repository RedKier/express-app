import 'reflect-metadata';

import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import { NODE_ENV, ORIGIN, PORT } from '@config/index';
import { ErrorMiddleware } from '@middlewares/errorMiddleware';
import { Routes } from '@interfaces/routesInterface';

export class App {
  app: Application;

  constructor(routes: Routes[]) {
    this.app = express();

    this.loadMiddlewares();
    this.loadRoutes(routes);
    this.loadErrorHandlingMiddleware();
  }

  public listen() {
    this.app.listen(PORT, () => {
      console.log(`App started at port ${PORT} in ${NODE_ENV}`);
    });
  }

  private loadMiddlewares() {
    this.app.use(cors({ origin: ORIGIN }));
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private loadRoutes(routes: Routes[]) {
    routes.map((route) => this.app.use('/', route.router));
  }

  private loadErrorHandlingMiddleware() {
    this.app.use(ErrorMiddleware);
  }
}
