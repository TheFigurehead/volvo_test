import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Customer } from './../lib/entities/customer.entity';
import { JwtPayload } from './interfaces/jwt-payload';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private customerService: CustomerService,
  ) {}

  async createJwt(
    user: Customer,
  ): Promise<{ data: JwtPayload; token: string; refresh: string }> {
    const expiresIn = this.configService.get('ACCESS_TOKEN_EXPIRES_IN');

    const data: JwtPayload = {
      email: user.email,
      id: user.id,
    };

    const jwt = this.jwtService.sign(data, {
      expiresIn,
    });
    const refreshToken = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      },
    );

    await this.customerService.updateRefreshToken(user.id, refreshToken);

    return {
      data,
      token: jwt,
      refresh: refreshToken,
    };
  }

  async createAccessTokenFromRefreshToken(refreshToken: string): Promise<any> {
    const data = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
    });

    if (!data) {
      throw new Error('Invalid refresh token');
    }

    const user: any = await this.prisma.customer.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.createJwt(user);
  }
  async deleteToken(token: string) {
    const data = await this.jwtService.verifyAsync(token);

    if (!data) {
      throw new Error('Invalid token');
    }

    const user: any = await this.prisma.customer.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    await this.prisma.token.delete({
      where: {
        id: user.token.id,
      },
    });

    return true;
  }
}
