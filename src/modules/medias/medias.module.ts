import { Module } from "@nestjs/common";
import { MediasController } from "./medias.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Media } from "./entities/media.entity";
import { MediasService } from "./medias.service";
import { StorageModule } from "src/infrastructure";

@Module({
  imports: [TypeOrmModule.forFeature([Media]), StorageModule],
  controllers: [MediasController],
  providers: [MediasService],
  exports: [MediasService],
})
export class MediasModule {}
