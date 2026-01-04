import {
  AbstractCrudService,
  RecurrenceInterval,
  RecurringTransaction,
  Transaction,
  User,
} from '@app/common';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addDays, addMonths, addWeeks, addYears } from 'date-fns';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { endOfMonth } from 'date-fns';

@Injectable()
export class RecurringTransactionService extends AbstractCrudService<RecurringTransaction> {
  private readonly logger = new Logger(RecurringTransactionService.name);

  constructor(
    @InjectRepository(RecurringTransaction)
    private readonly recurringTransactionRepository: Repository<RecurringTransaction>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(recurringTransactionRepository);
  }

  async createRecurringTransaction(
    createDto: CreateTransactionDto,
    user: User,
  ) {
    const { recurrenceInterval, recurrenceEndDate, date, ...transactionData } =
      createDto;
    const userDocument = await this.userRepository.findOneBy({ id: user.id });
    const householdId = userDocument.householdId;
    if (!householdId) {
      throw new BadRequestException('User is not part of any household');
    }

    const startDate = date ? new Date(date) : new Date();
    // If start date is in the past or today, we set nextRunDate to it.
    // The cron (or manual check) will pick it up and process it.

    // HOWEVER, for better UX checking "Recurring" usually means "Start from this date".
    // If the date is TODAY, we probably want to create the first one immediately OR let the cron pick it up.
    // Let's set nextRunDate to startDate.

    return this.create({
      ...transactionData,
      householdId,
      name: user.name, // Using user name as transaction name/author
      interval: recurrenceInterval as RecurrenceInterval,
      startDate: startDate,
      nextRunDate: startDate,
      endDate: recurrenceEndDate ? new Date(recurrenceEndDate) : null,
    });
  }

  @Cron(CronExpression.EVERY_10_HOURS)
  async processDueTransactions() {
    this.logger.debug('Checking for due recurring transactions...');
    console.log('Checking for due recurring transactions...');
    const now = new Date();

    const dueTransactions = await this.recurringTransactionRepository.find({
      where: {
        nextRunDate: LessThanOrEqual(now),
      },
    });

    if (dueTransactions.length === 0) {
      return;
    }

    this.logger.log(`Found ${dueTransactions.length} due transactions.`);

    for (const recurring of dueTransactions) {
      await this.processSingleRecurringTransaction(recurring);
    }
  }

  private async processSingleRecurringTransaction(
    recurring: RecurringTransaction,
  ) {
    // Prevent infinite loops or massive batch processing by limiting to 3 months of generation per run
    const processingLimitDate = addMonths(recurring.nextRunDate, 3);
    const now = new Date();

    while (
      recurring.nextRunDate <= now &&
      recurring.nextRunDate <= processingLimitDate
    ) {
      // Check if end date reached
      if (recurring.endDate && recurring.nextRunDate > recurring.endDate) {
        // Stop and maybe delete or mark inactive?
        // For now just stop processing.
        break;
      }

      // Create the real transaction
      await this.transactionRepository.save({
        name: recurring.name,
        amount: recurring.amount,
        date: recurring.nextRunDate,
        category: recurring.category,
        type: recurring.type,
        description: recurring.description,
        householdId: recurring.householdId,
      });

      this.logger.log(
        `Created transaction for recurring ${recurring.id} at ${recurring.nextRunDate}`,
      );

      // Update last run
      recurring.lastRunDate = recurring.nextRunDate;

      // Calculate next run
      recurring.nextRunDate = this.calculateNextDate(
        recurring.nextRunDate,
        recurring.interval,
      );
    }

    // Save updated recurrence state
    await this.recurringTransactionRepository.save(recurring);
  }

  private calculateNextDate(
    currentDate: Date,
    interval: RecurrenceInterval,
  ): Date {
    switch (interval) {
      case 'daily':
        return addDays(currentDate, 1);
      case 'weekly':
        return addWeeks(currentDate, 1);
      case 'monthly':
        return addMonths(currentDate, 1);
      case 'yearly':
        return addYears(currentDate, 1);
      default:
        return addMonths(currentDate, 1);
    }
  }

  // Helper for frontend projection
  async getActiveRecurringTransactions(user: User) {
    const userDocument = await this.userRepository.findOneBy({ id: user.id });
    const householdId = userDocument.householdId;
    if (!householdId) {
      throw new BadRequestException('User is not part of any household');
    }
    return this.recurringTransactionRepository.find({
      where: { householdId },
    });
  }

  async calculateForecast(user: User): Promise<number> {
    const activeRecurring = await this.getActiveRecurringTransactions(user);
    if (activeRecurring.length === 0) {
      return 0;
    }

    const now = new Date();
    const endOfCurrentMonth = endOfMonth(now);
    let totalForecast = 0;

    for (const recurring of activeRecurring) {
      // We simulate the next runs from the current nextCheckDate (or now if it's in the past but hasn't run yet?
      // actually nextRunDate is the source of truth for next run)
      // Ensure we don't count past transactions if the cron hasn't run yet,
      // but for forecast "remaining this month" we probably want to include anything pending + future in this month.

      // Let's iterate from recurring.nextRunDate until we pass endOfCurrentMonth

      let tempDate = new Date(recurring.nextRunDate);
      while (tempDate <= endOfCurrentMonth) {
        // Check if end date reached
        if (recurring.endDate && tempDate > recurring.endDate) {
          break;
        }
        // Only add if it's in the future (or strictly "remaining" which implies >= now)
        // If the cron hasn't picked it up yet (nextRunDate < now), it's effectively a "pending" expense that will happen soon.
        // So we count it.

        // Depending on type, add or subtract?
        // User asked for "forecasted amount to pay", usually implies Expenses.
        // If it's income, should we subtract? Or just ignore?
        // "forecasted amount to pay by the end of the month" -> Expenses.
        if (recurring.type === 'expense') {
          totalForecast += recurring.amount;
        }

        tempDate = this.calculateNextDate(tempDate, recurring.interval);
      }
    }

    return totalForecast;
  }
}
