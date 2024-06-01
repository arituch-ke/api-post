import * as repositories from '@/repositories';
import UserService from './UserService';

// Inject repositories of each service into the service
const userService = new UserService(repositories.blog);

const services = {
  UserService: userService,
};

Object.values(services).forEach(service => {
  service.injectServices(services);
});

export {services as default, userService as UserService};
