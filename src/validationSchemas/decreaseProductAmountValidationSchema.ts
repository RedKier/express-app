import { body, param, ValidationChain } from 'express-validator';

export const decreaseProductAmountValidationSchema: ValidationChain[] = [
  param('id').isUUID().not().isEmpty(),
  body('amount').isInt({ gt: 0 }).not().isEmpty(),
];
