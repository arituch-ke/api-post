import Logger from '@/helpers/Logger';
import SequelizeConnection from '@/helpers/SequelizeConnection';
import './transports/http';

const main = async () => {
  try {
    Logger.info('Starting application...');
    await SequelizeConnection.connectAll();
    Logger.info('Connected to all databases');
  } catch (error) {
    const exit = process.exit;
    exit(1);
  }
};

main();
