import { Test, TestingModule } from '@nestjs/testing';
import { RecurringTransactionService } from './recurring-transaction.service';
import {
  createMockRepository,
  MockRepository,
  RecurringTransaction,
  User,
} from '@app/common';
import { Transaction } from '@app/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { subDays } from 'date-fns';

describe('RecurringTransactionService', () => {
  let service: RecurringTransactionService;
  let recurringRepo: MockRepository<RecurringTransaction>;
  let transactionRepo: MockRepository<Transaction>;
  let userRepo: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecurringTransactionService,
        {
          provide: getRepositoryToken(RecurringTransaction),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<RecurringTransactionService>(
      RecurringTransactionService,
    );
    recurringRepo = module.get(getRepositoryToken(RecurringTransaction));
    transactionRepo = module.get(getRepositoryToken(Transaction));
    userRepo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processDueTransactions', () => {
    it('should process due transactions and create real transactions', async () => {
      const now = new Date();
      const pastDate = subDays(now, 1);

      const distinctRecurringTx = {
        id: '1',
        name: 'Test Recurring',
        amount: 100,
        interval: 'monthly',
        nextRunDate: pastDate,
        lastRunDate: null,
        endDate: null,
        householdId: 'h1',
        category: 'other',
        type: 'expense',
      } as any as RecurringTransaction;

      recurringRepo.find!.mockResolvedValue([distinctRecurringTx]);
      transactionRepo.save!.mockResolvedValue({});
      recurringRepo.save!.mockResolvedValue({});

      await service.processDueTransactions();

      // Should find due transactions
      expect(recurringRepo.find).toHaveBeenCalled();

      // Should create a transaction
      expect(transactionRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Recurring',
          amount: 100,
          date: pastDate,
        }),
      );

      // Should save updated recurring transaction
      expect(recurringRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          lastRunDate: expect.any(Date), // Should be pastDate actually, or updated nextRun
        }),
      );
    });

    it('should handle catch-up for missed runs', async () => {
      const longAgo = subDays(new Date(), 2); // 2 days ago
      const recurringTx = {
        id: '2',
        name: 'Daily Catchup',
        amount: 50,
        interval: 'daily',
        nextRunDate: longAgo,
        householdId: 'h1',
        category: 'other',
        type: 'expense',
      } as any as RecurringTransaction;

      recurringRepo.find!.mockResolvedValue([recurringTx]);

      await service.processDueTransactions();

      // Should run for longAgo, then longAgo + 1 day
      // 2 iterations typically (today is 0 offset)
      // If longAgo is -2d.
      // Iter 1: date = -2d. next = -1d.
      // Iter 2: date = -1d. next = 0d (Today).
      // Iter 3: date = 0d. next = +1d.
      // If "Less than or equal now".
      // So -2, -1, 0 = 3 times.

      expect(transactionRepo.save).toHaveBeenCalledTimes(3);
    });

    it('should limit catch-up to 3 months per run', async () => {
      const oneYearAgo = subDays(new Date(), 365);
      const recurringTx = {
        id: '3',
        name: 'Yearly Catchup',
        amount: 10,
        interval: 'daily',
        nextRunDate: oneYearAgo,
        householdId: 'h1',
        category: 'other',
        type: 'expense',
      } as any as RecurringTransaction;

      recurringRepo.find!.mockResolvedValue([recurringTx]);

      await service.processDueTransactions();

      // Should run for roughly 3 months (90-93 days)
      // daily interval.
      // 3 months from oneYearAgo.
      const calls = (transactionRepo.save as jest.Mock).mock.calls.length;
      expect(calls).toBeGreaterThan(80); // roughly 3 months
      expect(calls).toBeLessThan(100); // definitely not 365
    });
  });
  describe('calculateForecast', () => {
    it('should calculate forecast for remaining days in month', async () => {
      const now = new Date();
      // Force "now" to be beginning of month to have deterministic run, or just mock date?
      // Or just use relative dates.
      // Let's assume we are at 28th of a 30 day month.
      // We can't easily mock "new Date()" inside the service without a DateProvider.
      // But we can check if I can use current date logic.
      // The service uses "new Date()" internally.
      // I'll rely on whatever "now" is.
      // I'll create a recurring transaction that runs DAILY starting TOMORROW.
      // And I will check end of month.

      const {
        endOfMonth,
        addDays,
        differenceInCalendarDays,
      } = require('date-fns');
      const start = addDays(new Date(), 1); // Tomorrow
      const end = endOfMonth(new Date());
      const daysRemaining = differenceInCalendarDays(end, start) + 1; // +1 inclusive if start <= end

      // If we are at the very end of month, daysRemaining might be 0 or negative if start > end.
      // To be safe, let's mock the recurring transaction to be running DAILY.

      // If daysRemaining <= 0, forecast is 0.

      const user = { id: 'u1', name: 'User' } as User;
      userRepo.findOneBy = jest.fn().mockResolvedValue({ householdId: 'h1' });

      const recurringTx = {
        id: 'r1',
        amount: 100,
        interval: 'daily',
        nextRunDate: start, // Next run is tomorrow
        householdId: 'h1',
        type: 'expense',
      } as RecurringTransaction;

      recurringRepo.find!.mockResolvedValue([recurringTx]);

      const forecast = await service.calculateForecast(user);

      // If start > end (e.g. today is last day of month), forecast 0.
      // If start <= end, forecast = daysRemaining * 100.

      if (start > end) {
        expect(forecast).toBe(0);
      } else {
        expect(forecast).toBe(daysRemaining * 100);
      }
    });
  });
});
