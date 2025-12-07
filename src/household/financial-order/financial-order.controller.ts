import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FinancialOrderService } from './financial-order.service';
import { CreateFinancialOrderDto } from './dto/create-financial-order.dto';
import { UpdateFinancialOrderDto } from './dto/update-financial-order.dto';

@Controller('income')
export class FinancialOrderController {
  constructor(private readonly incomeService: FinancialOrderService) {}

  @Post()
  async create(@Body() createIncomeDto: CreateFinancialOrderDto) {
    return await this.incomeService.create(createIncomeDto);
  }

  @Get()
  async findAll() {
    return await this.incomeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.incomeService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateIncomeDto: UpdateFinancialOrderDto,
  ) {
    return await this.incomeService.update(id, updateIncomeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.incomeService.remove(id);
  }
}
