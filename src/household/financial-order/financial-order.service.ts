import { Injectable } from '@nestjs/common';
import { CreateFinancialOrderDto } from './dto/create-financial-order.dto';
import { UpdateFinancialOrderDto } from './dto/update-financial-order.dto';

@Injectable()
export class FinancialOrderService {
  create(createFinancialOrderDto: CreateFinancialOrderDto) {
    return 'This action adds a new financialOrder';
  }

  findAll() {
    return `This action returns all financialOrder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} financialOrder`;
  }

  update(id: number, updateFinancialOrderDto: UpdateFinancialOrderDto) {
    return `This action updates a #${id} financialOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} financialOrder`;
  }
}
