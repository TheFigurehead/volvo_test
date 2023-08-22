import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Customer } from 'lib/entities/customer.entity';
import { CustomerDeleteInput, CustomerUpdateInput } from './dto/customer.input';
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
  @Mutation(() => Customer)
  async updateCustomer(@Args('data') data: CustomerUpdateInput) {
    return this.customerService.update(data);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Customer)
  async deleteCustomer(@Args('data') data: CustomerDeleteInput) {
    return this.customerService.delete(data);
  }
}
