import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export class IncreaseProductAmountDTO {
  @IsUUID()
  productId: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
