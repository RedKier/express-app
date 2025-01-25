import 'reflect-metadata';

import express, { Application } from 'express';
import { PORT, NODE_ENV } from '@/config';

export class App {
  app: Application;

  constructor() {
    this.app = express();
  }

  public listen() {
    this.app.listen(PORT, () => {
      console.log(`App started at port ${PORT} in ${NODE_ENV}`);
    });
  }
}
