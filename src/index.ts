import Logger from '@/helpers/Logger';
import SequelizeConnection from '@/helpers/SequelizeConnection';
import '@/transports/http';

SequelizeConnection.connectAll()
  .then(() => {
    Logger.info('Connected to all databases');
  })
  .catch(() => {
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });

Logger.info('Starting application...');
