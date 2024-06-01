import passport from '../configs/passport';

export const isAuthenticated = passport.authenticate('jwt', {
  session: false,
  failWithError: true,
});
