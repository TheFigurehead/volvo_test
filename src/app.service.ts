import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Goodbye, cruel world.\n I'm leaving you today`;
  }
}
