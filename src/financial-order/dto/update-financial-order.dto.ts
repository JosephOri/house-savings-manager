import { PartialType } from '@nestjs/mapped-types';
import { CreateFinancialOrderDto } from './create-financial-order.dto';

export class UpdateFinancialOrderDto extends PartialType(
  CreateFinancialOrderDto,
) {}
