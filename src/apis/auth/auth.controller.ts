import { Controller, Get, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { OAuthUser } from './interfaces/auth.interface';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('refresh'))
  @Get('/refresh')
  async refreshAccessToken(@Req() req: Request & OAuthUser): Promise<string> {
    return await this.authService.refreshAccessToken(req.user.email);
  }

  @UseGuards(AuthGuard('google'))
  @Get('/login/google')
  async loginGoogle(@Req() req: Request & OAuthUser, @Res() res: Response) {
    await this.authService.loginGoogle(req.user, res);
    res.redirect(this.configService.get<string>('auth.googleRedirectURL'));
  }
}
