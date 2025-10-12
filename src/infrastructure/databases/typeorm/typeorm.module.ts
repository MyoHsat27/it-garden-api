import { Global, Module } from '@nestjs/common';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from 'src/config';

@Global()
@Module({
  imports: [NestTypeOrmModule.forRootAsync(typeOrmAsyncConfig)],
})
export class TypeOrmModule {}
