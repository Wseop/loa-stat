import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from 'src/commons/users/schemas/user.schema';
import { UsersService } from 'src/commons/users/users.service';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  getAccessToken(user: User): string {
    return this.jwtService.sign(
      {
        sub: user,
      },
      {
        secret: this.configService.get<string>('auth.accessSecret'),
        expiresIn: '1h',
      },
    );
  }

  setRefreshToken(user: User, res: Response): void {
    const refreshToken = this.jwtService.sign(
      {
        sub: user,
      },
      {
        secret: this.configService.get<string>('auth.refreshSecret'),
        expiresIn: '2w',
      },
    );

    res.setHeader('set-Cookie', `refreshToken=${refreshToken}; path=/;`);
    // res.setHeader('set-Cookie', `refreshToken=${refreshToken}; path=/; domain=; SameSite=None; Secure; httpOnly`, );
    // res.setHeader('Access-Control-Allow-Origin', 'front-end-url');
  }

  async refreshAccessToken(email: string): Promise<string> {
    const user = await this.usersService.findOne(email);
    if (user) {
      return this.getAccessToken(user);
    } else {
      return null;
    }
  }

  async loginGoogle(user: User, res: Response): Promise<void> {
    // 회원 조회
    let result = await this.usersService.findOne(user.email);
    if (!result) {
      // 신규 회원 가입 처리
      result = await this.usersService.create(user);
    }

    // refresh token 추가
    this.setRefreshToken(user, res);
  }
}
