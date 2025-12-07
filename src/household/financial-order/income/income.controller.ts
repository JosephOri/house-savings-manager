import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  async create(@Body() createIncomeDto: CreateIncomeDto) {
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
    @Body() updateIncomeDto: UpdateIncomeDto,
  ) {
    return await this.incomeService.update(id, updateIncomeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.incomeService.remove(id);
  }
}
