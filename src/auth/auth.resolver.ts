import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginInput } from 'src/auth/dto/login.input';
import { SignupInput } from 'src/auth/dto/signup.input';
import { CustomerService } from './../customer/customer.service';
import { Token } from 'lib/entities/token.entity';
import { AuthService } from './auth.service';
import { RefreshTokenInput } from 'src/auth/dto/refresh-token.input';

@Resolver(() => Token)
export class AuthResolver {
  constructor(
    private readonly customerService: CustomerService,
    private readonly authService: AuthService,
  ) {}

  @Query(() => Token)
  async login(
    @Context() context: any,
    @Args('data') data: LoginInput,
  ): Promise<any> {
    const user: any = await this.customerService.login(data);

    const { token, refresh } = await this.authService.createJwt(user);

    return { token, refresh };
  }
  @Query(() => Token)
  async signup(
    @Context() context: any,
    @Args('data') data: SignupInput,
  ): Promise<any> {
    const user: any = await this.customerService.create(data);

    const { token, refresh } = await this.authService.createJwt(user);

    return { token, refresh };
  }
  @Mutation(() => Token)
  async refreshToken(@Args('input') input: RefreshTokenInput) {
    const { token, refresh } =
      await this.authService.createAccessTokenFromRefreshToken(
        input.refreshToken,
      );

    return {
      token: token,
      refresh: refresh,
    };
  }
  @Mutation(() => Boolean)
  async logout(@Args('token') token: string) {
    return await this.authService.deleteToken(token);
  }
  @Mutation(() => Boolean)
  async activate(@Args('code') code: string) {
    return await this.customerService.activate(code);
  }
}
