import { Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { User } from 'src/commons/users/schemas/user.schema';

export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger: Logger = new Logger(JwtGoogleStrategy.name);

  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.CALLBACK_URL}/auth/login/google`,
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
