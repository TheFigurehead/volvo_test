import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Customer } from 'lib/entities/customer.entity';
import { CustomerUpdateInput } from './dto/customer.input';
import { CustomerService } from './customer.service';
import { GetCustomerInput } from './dto/customer.input';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/auth.guard';
import { Roles } from './roles.decorator';
import { Role } from './role.enum';

import { JwtAuthGuard } from './../auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => [Customer])
  async customers(@Args('data') { skip, take, where }: GetCustomerInput) {
    return this.customerService.findAll({ skip, take, where });
  }

  @Roles(Role.ADMIN)
  @Query(() => Customer)
  async customerByEmail(@Args('email') email: string) {
    return this.customerService.findByEmail(email);
  }
  @Roles(Role.ADMIN)
  @Query(() => Customer)
  async findById(@Args('id') id: string) {
    return this.customerService.findById(id);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Customer)
  async updateCustomerById(
    @Args('data') data: CustomerUpdateInput,
    @Args('id') id: string,
  ) {
    return this.customerService.update(id, data);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Customer)
  async updateCustomerByEmail(
    @Args('data') data: CustomerUpdateInput,
    @Args('email') email: string,
  ) {
    return this.customerService.updateByEmail(email, data);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Customer)
  async deleteCustomerById(@Args('id') id: string) {
    return this.customerService.delete(id);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Customer)
  async deleteCustomerByEmail(@Args('email') email: string) {
    return this.customerService.deleteByEmail(email);
  }
}
