import { Global, Module } from '@nestjs/common';
import { BullBoardModule as NestBullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import * as basicAuth from 'express-basic-auth';

@Global()
@Module({
  imports: [
    NestBullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
      middleware: basicAuth({
        challenge: true,
        users: { admin: 'yngWIE500' },
      }),
    }),
  ],
})
export class BullBoardModule {}
