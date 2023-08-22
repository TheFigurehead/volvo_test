import { Prisma } from '@prisma/client';
import { Role } from '../../src/customer/role.enum';

export const customers: Prisma.CustomerUpsertArgs['create'][] = [
  {
    id: '9e391faf-64b2-4d4c-b879-463532920fd3',
    email: 'user@gmail.com',
    password: 'randow-password',
    role: Role.ADMIN,
  },
  {
    id: '9e391faf-64b2-4d4c-b879-463532920fd4',
    email: 'user2@gmail.com',
    password: 'randow-password',
    role: Role.USER,
  },
];
