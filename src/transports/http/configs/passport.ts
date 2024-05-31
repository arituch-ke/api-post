import * as joi from 'joi';
import * as passport from 'passport';
import {
  VerifiedCallback,
  Strategy as JWTStrategy,
  ExtractJwt,
} from 'passport-jwt';
import Logger from '@/helpers/Logger';
import environment from '@/configs/environment';
import contextStorage from '@/configs/contextStorage';

export enum APIRole {
  USER_API = 'USER_API',
  ADMIN_API = 'ADMIN_API',
}

interface IAPIJWTPayload {
  role: APIRole;
}

/**
 * JWT authentication callback
 * @param {unknown} payload JWT payload
 * @param {VerifiedCallback} done Callback function to be called when authentication is complete
 * @return {void}
 */
function jwtAuthCallback(payload: unknown, done: VerifiedCallback): void {
  const validatePayloadResult = joi
    .object<IAPIJWTPayload>()
    .keys({
      role: joi.string().valid(APIRole.USER_API, APIRole.ADMIN_API).required(),
    })
    .validate(payload);

  const error = validatePayloadResult.error;

  if (error) {
    Logger.warning(
      `Failed to authenticate user with JWT: invalid token payload ${error.message}`,
      {payload}
    );
    return done(null, false);
  }

  const {role} = validatePayloadResult.value;

  // Note: this is not actually an end-user, but an internal API user
  const user = {role};

  Logger.info('Successfully authenticated user with JWT', {
    user,
  });

  // Set context storage for logging (userId is used as one of logging format, so we set "role" as user ID)
  contextStorage.set('userId', user.role);
  done(null, user);
}

const strategy = new JWTStrategy(
  {
    secretOrKey: environment.API_JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    passReqToCallback: false,
  },
  jwtAuthCallback
);

// Even the strategy is JWT, it still used as some sort of API Key
passport.use('api-key', strategy);

export default passport;
