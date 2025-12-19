import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from '@repo/shared';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
