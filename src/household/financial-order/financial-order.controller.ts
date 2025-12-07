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
  constructor(private readonly financialOrderService: FinancialOrderService) {}

  @Post()
  async create(@Body() createFinancialOrderDto: CreateFinancialOrderDto) {
    return await this.financialOrderService.create(createFinancialOrderDto);
  }

  @Get()
  async findAll() {
    return await this.financialOrderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.financialOrderService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFinancialOrderDto: UpdateFinancialOrderDto,
  ) {
    return await this.financialOrderService.update(id, updateFinancialOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.financialOrderService.remove(id);
  }
}
