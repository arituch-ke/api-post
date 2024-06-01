import * as repositories from '@/repositories';
import UserService from './UserService';
import AuthenticationService from './AuthenticationService';

// Inject repositories of each service into the service
const userService = new UserService(repositories.blog);
const authenticationService = new AuthenticationService(repositories.blog);

const services = {
  UserService: userService,
  AuthenticationService: authenticationService,
};

Object.values(services).forEach(service => {
  service.injectServices(services);
});

export {
  services as default,
  userService as UserService,
  authenticationService as AuthenticationService,
};
