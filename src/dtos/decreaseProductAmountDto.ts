import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export class DecreaseProductAmountDTO {
  @IsUUID()
  productId: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
