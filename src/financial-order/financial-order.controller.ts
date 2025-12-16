import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FinancialOrderService } from './financial-order.service';
import { UpdateFinancialOrderDto } from './dto/update-financial-order.dto';
import { CurrentUser, JwtAuthGuard, User } from '@app/common';
import { CreateFinancialOrderDto } from './dto/create-financial-order.dto';

@Controller('financial-order')
export class FinancialOrderController {
  constructor(private readonly financialOrderService: FinancialOrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Body() createFinancialOrderDto: CreateFinancialOrderDto,
    @CurrentUser() user: User,
  ) {
    return await this.financialOrderService.createOrder(
      createFinancialOrderDto,
      user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAllByUser(@CurrentUser() user: User) {
    return this.financialOrderService.findAllByUser(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financialOrderService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFinancialOrderDto: UpdateFinancialOrderDto,
  ) {
    return this.financialOrderService.update(id, updateFinancialOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financialOrderService.remove(id);
  }
}
