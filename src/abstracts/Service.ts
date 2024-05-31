/* eslint-disable @typescript-eslint/no-unused-vars */
import {Validation} from './Validation';

/**
 * Base Service
 */
export default abstract class Service extends Validation {
  /**
   * Inject services, the services injected must be constructed
   * @param {Object.<string, Service>} services Services
   * @return {void} Nothing
   */
  injectServices(services: Record<string, Service>): void {
    // Do nothing
  }
}
