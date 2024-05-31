import passport from '../configs/passport';

export const isAuthenticated = passport.authenticate('api-key', {
  session: false,
  failWithError: true,
});
