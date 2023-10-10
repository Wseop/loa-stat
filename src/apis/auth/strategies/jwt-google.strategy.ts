import { Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { User } from 'src/commons/users/schemas/user.schema';

export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger: Logger = new Logger(JwtGoogleStrategy.name);

  constructor() {
    super({
      clientID: process.env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:7942/auth/login/google',
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile): User {
    return {
      email: profile.emails[0].value,
      name: profile.displayName,
    };
  }
}
