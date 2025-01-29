import { body, ValidationChain } from 'express-validator';

export const createProductValidationSchema: ValidationChain[] = [
  body('name').isString().isLength({ max: 50 }).not().isEmpty(),
  body('description').isString().isLength({ max: 50 }).not().isEmpty(),
  body('price').isInt({ gt: 0 }).not().isEmpty(),
  body('stock').isInt({ gt: 0 }).not().isEmpty(),
];
