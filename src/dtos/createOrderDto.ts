import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsPositive,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class ProductItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}

export class CreateOrderDTO {
  @IsUUID()
  customerId: string;

  @IsArray()
  @ArrayNotEmpty()
  @Type(() => ProductItemDto)
  @ValidateNested({ each: true })
  productsList: ProductItemDto[];
}
