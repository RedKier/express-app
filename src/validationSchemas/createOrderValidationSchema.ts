import { body, ValidationChain } from 'express-validator';

export const createOrderValidationSchema: ValidationChain[] = [
  body('customerId').isUUID().not().isEmpty(),
  body('productsList').isArray({ min: 1 }),
  body('productsList.*.productId').isUUID().not().isEmpty(),
  body('productsList.*.amount').isInt({ gt: 0 }).not().isEmpty(),
];
