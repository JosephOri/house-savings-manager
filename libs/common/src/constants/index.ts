import { Repository } from 'typeorm';

export const kafkaTopics = {
  HOUSEHOLD_INVITES: 'household-invites',
} as const;
export type MockRepository<T = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

export const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});
