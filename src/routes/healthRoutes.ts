import { Request, Response, Router } from 'express';

import { Routes } from '@interfaces/routesInterface';

export class HealthRoutes implements Routes {
  public path = '/health';
  public router = Router();

  constructor() {
    this.loadRoutes();
  }

  private loadRoutes() {
    this.router.get(this.path, this.checkHealth);
  }

  private checkHealth(request: Request, response: Response) {
    response.status(200).json({ serverStatus: 'healthy' });
  }
}
