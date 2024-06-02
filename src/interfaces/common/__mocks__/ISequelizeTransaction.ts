/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Transaction,
  TransactionOptions,
  LOCK,
} from 'sequelize/types/transaction';

// Create a more comprehensive mock of the Transaction object
const mockTransaction: Transaction = {
  commit: jest.fn().mockResolvedValue(undefined),
  rollback: jest.fn().mockResolvedValue(undefined),
  afterCommit: jest.fn().mockImplementationOnce(callback => callback()),
  LOCK: LOCK,
};

// Mock implementation of the StartTransaction
const mockStartTransaction: (
  options?: TransactionOptions
) => Promise<Transaction> = jest.fn((options?: TransactionOptions) => {
  return Promise.resolve(mockTransaction);
});

// Mock implementation of WithOptionsAndCallback
const mockWithOptionsAndCallback: <T = any>(
  options: TransactionOptions,
  autoCallback: (t: Transaction) => Promise<T>
) => Promise<T> = jest.fn(async (options, autoCallback) => {
  const transaction = await mockStartTransaction(options);
  return autoCallback(transaction);
});

// Mock implementation of WithCallback
const mockWithCallback: <T = any>(
  autoCallback: (t: Transaction) => Promise<T>
) => Promise<T> = jest.fn(async autoCallback => {
  const transaction = await mockStartTransaction();
  return autoCallback(transaction);
});

// Combine into a single object for use in tests
const mockSequelizeTransactionHelper = {
  startTransaction: mockStartTransaction,
  withOptionsAndCallback: mockWithOptionsAndCallback,
  withCallback: mockWithCallback,
  runTransaction: jest
    .fn()
    .mockImplementation(async (options, autoCallback) => {
      return autoCallback(mockTransaction);
    }),
};

export default mockSequelizeTransactionHelper;
