import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CurrentUser, JwtAuthGuard, User } from '@app/common';
import { RecurringTransactionService } from './recurring-transaction.service';

@ApiTags('transaction')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly recurringTransactionService: RecurringTransactionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Body() createTransactionDto: CreateTransactionDto,
    @CurrentUser() user: User,
  ) {
    if (createTransactionDto.recurrenceInterval) {
      return await this.recurringTransactionService.createRecurringTransaction(
        createTransactionDto,
        user,
      );
    }
    return await this.transactionService.createTransaction(
      createTransactionDto,
      user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAllByUser(@CurrentUser() user: User) {
    return this.transactionService.findAllByUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('recurring')
  async findAllRecurringByUser(@CurrentUser() user: User) {
    return this.recurringTransactionService.getActiveRecurringTransactions(
      user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('date')
  findAllGroupedByDate(@CurrentUser() user: User) {
    return this.transactionService.getAllGroupedByDate(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(id);
  }
}
