import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Base } from 'lib/entities/base.entity';
import { Role } from './../../customer/role.enum';

@ObjectType()
export class Customer extends Base {
  @Field(() => String)
  email: string;
  @Field(() => String)
  role: Role;
}
