import environment from '@/configs/environment';
import * as formats from '@/configs/logFormat';
import * as winston from 'winston';
import contextStorage from '@/configs/contextStorage';
import {
  LoggingWinston as StackdriverLogging,
  Options as StackdriverOptions,
} from '@google-cloud/logging-winston';
import * as packageJson from '../../package.json';

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Logger
 */
class Logger {
  private static masterLogger: winston.Logger;
  private static project: string = packageJson.name;
  private static version: string = packageJson.version;
  private _label: string | null = null;

  /**
   * Constructor
   * @param {string|null} label Log label
   */
  public constructor(label: string | null = null) {
    this._label = label;
  }

  /**
   * Initialize the default logger
   * @returns {void} Nothing
   */
  public static initialize() {
    if (this.masterLogger) return;

    const transports = [];

    if (['staging', 'production'].includes(environment.NODE_ENV)) {
      const options: StackdriverOptions = {
        levels: winston.config.syslog.levels,
        level: 'debug', // set to debug to send all log to GCP, filter later in GCP logging
        format: formats.json,

        /*
         * Use stdout to print log as JSON instead of connecting to GCP logging,
         * the agent inside GCP will take care of the rest
         */
        redirectToStdout: true,

        /*
         * do not store everything inside `message` field, spread it out so that
         * the format is `jsonPayload.message` and `jsonPayload.metadata`
         */
        useMessageField: false,
      };
      const stackdriverLogging = new StackdriverLogging(options);

      transports.push(stackdriverLogging);
    } else {
      const consoleTransport = new winston.transports.Console({
        level: environment.LOG_LEVEL ?? 'debug',
        format: formats.plain,
      });

      transports.push(consoleTransport);
    }

    this.masterLogger = winston.createLogger({
      levels: winston.config.syslog.levels,
      format: formats.default, // as default
      transports,
    });
  }

  /**
   * Create a new logger based on specified log label
   * @param {string} label Log label
   * @returns {Logger} Logger instance
   */
  public label(label: string): Logger {
    return new Logger(label);
  }

  /**
   * Format log metadata
   * @param {*} metadata Log metadata
   * @returns {*} Formatted log metadata
   * @private
   */
  private formatLogMetadata(metadata: any) {
    const requestId = contextStorage.get('requestId') || '<--- no request --->';
    const userId = contextStorage.get('userId') || -1;
    const label = this._label ?? this.getAutomaticLabel();

    return {
      project: Logger.project,
      label: label,
      action: label,
      requestId,
      userId,
      [label]: metadata,
    };
  }

  /**
   * Get automatic logLabel
   * @return {string} Automatic logLabel
   */
  getAutomaticLabel(): string {
    /*
     * Stack trace looks like this:
     * Error
     *    at Logger.getAutomaticLabel (C:\Users\user\Documents\GitHub\firebase-functions-typescript\client-api\src\helpers\Logger.ts:100:23)
     *    at Logger.formatLogMetadata (C:\Users\user\Documents\GitHub\firebase-functions-typescript\client-api\src\helpers\Logger.ts:81:22)
     *    at Logger.debug (C:\Users\user\Documents\GitHub\firebase-functions-typescript\client-api\src\helpers\Logger.ts:26:16)
     *    at ClientRepository.findById (C:\Users\user\Documents\GitHub\firebase-functions-typescript\client-api\src\repositories\ClientRepository.ts:50:13)
     *    ...
     *
     * So we split the stack trace by new line, and get the 5th line (index 4)
     */
    const [, , , , stackTrace]: Array<string> = String(new Error().stack).split(
      '\n'
    );
    const matches = stackTrace.match(/[/\\]([a-zA-Z0-9-_.]+)\.[jt]s/);

    const [, label = 'Unknown'] = matches ?? [];

    return label;
  }

  /**
   * Debug Log
   * @param {string} message Log message
   * @param {Object.<string, any>} metadata Log metadata
   * @returns {void} Nothing
   */
  public debug(message: string, metadata: {[key: string]: any} = {}): void {
    Logger.masterLogger.debug(message, this.formatLogMetadata(metadata));
  }

  /**
   * Info Log
   * @param {string} message Log message
   * @param {Object.<string, any>} metadata Log metadata
   * @returns {void} Nothing
   */
  public info(message: string, metadata: {[key: string]: any} = {}): void {
    Logger.masterLogger.info(message, this.formatLogMetadata(metadata));
  }

  /**
   * Warning Log
   * @param {string} message Log message
   * @param {Object.<string, any>} metadata Log metadata
   * @returns {void} Nothing
   */
  public warning(message: string, metadata: {[key: string]: any} = {}): void {
    Logger.masterLogger.warning(message, this.formatLogMetadata(metadata));
  }

  /**
   * Error Log
   * @param {string} message Log message
   * @param {Object.<string, any>} metadata Log metadata
   * @returns {void} Nothing
   */
  public error(message: string, metadata: {[key: string]: any} = {}): void {
    Logger.masterLogger.error(message, this.formatLogMetadata(metadata));
  }

  /**
   * Morgan logger
   * @param {string} morganMessage JSON-based morgan message
   * @returns {void} Nothing
   */
  morgan(morganMessage: string) {
    try {
      const {message, httpRequest = {}} = JSON.parse(morganMessage);
      const logMetadata = this.formatLogMetadata({});

      Logger.masterLogger.info(message || 'http request', {
        ...logMetadata,
        httpRequest,
      });
    } catch (error) {
      this.error(
        `Failed to parse morgan log message, logging as plain text instead. Message: ${morganMessage}`,
        {
          error,
          message: morganMessage,
        }
      );
    }
  }
}

Logger.initialize();

export default new Logger();
