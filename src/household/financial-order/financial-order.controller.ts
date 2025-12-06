import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FinancialOrderService } from './financial-order.service';
import { CreateFinancialOrderDto } from './dto/create-financial-order.dto';
import { UpdateFinancialOrderDto } from './dto/update-financial-order.dto';

@Controller('financial-order')
export class FinancialOrderController {
  constructor(private readonly financialOrderService: FinancialOrderService) {}

  @Post()
  create(@Body() createFinancialOrderDto: CreateFinancialOrderDto) {
    return this.financialOrderService.create(createFinancialOrderDto);
  }

  @Get()
  findAll() {
    return this.financialOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financialOrderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFinancialOrderDto: UpdateFinancialOrderDto) {
    return this.financialOrderService.update(+id, updateFinancialOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financialOrderService.remove(+id);
  }
}
