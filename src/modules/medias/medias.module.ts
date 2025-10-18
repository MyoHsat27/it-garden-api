import { Module } from '@nestjs/common';
import { MediasController } from './medias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { MediasService } from './medias.service';
import { StorageModule } from '../../infrastructure';
import { MediasRepository } from './medias.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Media]), StorageModule],
  controllers: [MediasController],
  providers: [MediasService, MediasRepository],
  exports: [MediasService, MediasRepository],
})
export class MediasModule {}
