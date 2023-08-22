import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetCustomerInput } from './dto/customer.input';
import { SignupInput } from 'src/auth/dto/signup.input';
import { CustomerUpdateInput } from './dto/customer.input';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomerService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}
  async findAll(params: GetCustomerInput) {
    const { skip, take, cursor, where } = params;

    return this.prisma.customer.findMany({
      skip,
      take,
      cursor,
      where,
    });
  }
  async login(data: { email: string; password: string }) {
    const { email, password } = data;
    const user = await this.prisma.customer.findUnique({
      where: { email },
    });

    if (!user) throw new Error('User not found');
    if (!user.active) throw new Error('User not activated');

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) throw new Error('Invalid password');

    return user;
  }
  update(id: string, data: CustomerUpdateInput) {
    return this.prisma.customer.update({
      where: { id },
      data: { ...data },
    });
  }
  updateByEmail(email: string, data: CustomerUpdateInput) {
    return this.prisma.customer.update({
      where: { email },
      data: { ...data },
    });
  }
  delete(id: string) {
    return this.prisma.customer.delete({
      where: { id },
    });
  }
  deleteByEmail(email: string) {
    return this.prisma.customer.delete({
      where: { email },
    });
  }
  async create(data: SignupInput) {
    const { password, email, ...rest } = data;
    const activationCode = await this.hashActivationCode(email);
    const hashedPassword = await this.hashPassword(password);
    const payload = {
      ...rest,
      email,
      activateCode: activationCode,
      password: hashedPassword,
    };
    return await this.prisma.customer.create({
      data: payload,
    });
  }
  async updateRefreshToken(id: string, refreshToken: string) {
    return await this.prisma.customer.update({
      where: { id },
      data: {
        token: {
          upsert: {
            create: {
              token: refreshToken,
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
            update: {
              token: refreshToken,
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    });
  }

  async activate(code: string) {
    const user = await this.prisma.customer.findUnique({
      where: {
        activateCode: code,
      },
    });

    if (!user) {
      throw new Error('Invalid activation code');
    }

    await this.prisma.customer.update({
      where: {
        id: user.id,
      },
      data: {
        active: true,
        activateCode: null,
      },
    });

    return true;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(
      Number.parseInt(this.configService.get('PASSWORD_HASH_SALT')),
    );
    return await bcrypt.hash(password, salt);
  }

  private async hashActivationCode(code: string): Promise<string> {
    const salt = Number.parseInt(this.configService.get('ACTIVATE_EMAIL_SALT'));
    return await bcrypt.hash(code, salt);
  }

  async findByEmail(email: string) {
    const user = await this.prisma.customer.findUnique({
      where: { email },
    });

    if (!user) throw new Error('User not found');

    return user;
  }

  async findById(id: string) {
    const user = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!user) throw new Error('User not found');

    return user;
  }
}
