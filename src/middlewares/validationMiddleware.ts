import { plainToInstance } from 'class-transformer';
import { iterate } from 'iterare';
import { validateOrReject, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/httpException';

export const ValidationMiddleware = (
  type,
  skipMissingProperties = false,
  whitelist = false,
  forbidNonWhitelisted = false,
) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const dto = plainToInstance(type, request.body);

    validateOrReject(dto, {
      skipMissingProperties,
      whitelist,
      forbidNonWhitelisted,
    })
      .then(() => {
        request.body = dto;

        next();
      })
      .catch((errors: ValidationError[]) => {
        const errorsResult = flattenErrorTree(errors);

        next(new HttpException(400, errorsResult.join(', ')));
      });
  };
};

const flattenErrorTree = (validationErrors: ValidationError[]) => {
  return iterate(validationErrors)
    .map((error) => mapValidationErrorsChildren(error))
    .flatten()
    .filter((item) => !!item.constraints)
    .map((item) => Object.values(item.constraints!))
    .flatten()
    .toArray();
};

const prependConstraints = (error: ValidationError): ValidationError => {
  const constraints = {};

  for (const key in error.constraints) {
    constraints[key] = `${error.constraints[key]}`;
  }

  return {
    ...error,
    constraints,
  };
};

const mapValidationErrorsChildren = (
  error: ValidationError,
): ValidationError[] => {
  if (!(error.children && error.children.length)) {
    return [error];
  }

  const validationErrors: ValidationError[] = [];

  for (const item of error.children) {
    if (item.children && item.children.length) {
      validationErrors.push(...mapValidationErrorsChildren(item));
    }
    validationErrors.push(prependConstraints(item));
  }

  return validationErrors;
};
