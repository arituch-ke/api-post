import {Transaction, TransactionOptions} from 'sequelize/types/transaction';

/**
 * Signature for a transaction operation that accepts transaction options and
 * a callback function which uses the transaction.
 * Returns a promise resolved with the type specified by the generic T.
 */
type WithOptionsAndCallback<T = any> = (
  options: TransactionOptions,
  autoCallback: (t: Transaction) => Promise<T>
) => Promise<T>;

/**
 * Signature for a transaction operation that accepts a callback function
 * which uses the transaction.
 * Returns a promise resolved with the type specified by the generic T.
 */
type WithCallback<T = any> = (
  autoCallback: (t: Transaction) => Promise<T>
) => Promise<T>;

/**
 * Signature for a function that may accept transaction options and
 * returns a promise resolved with a transaction object.
 */
type StartTransaction = (options?: TransactionOptions) => Promise<Transaction>;

/**
 * Combines various transaction-related function signatures into a single type.
 * This type alias can be used to define objects that need to support multiple
 * methods of initiating and managing transactions.
 */
type SequelizeTransactionHelper<T = any> = WithOptionsAndCallback<T> &
  WithCallback<T> &
  StartTransaction;

export default SequelizeTransactionHelper;
