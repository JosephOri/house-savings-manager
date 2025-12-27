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
});
