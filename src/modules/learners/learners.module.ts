import { forwardRef, Module } from "@nestjs/common";
import { LearnersService } from "./learners.service";
import { LearnersController } from "./learners.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Learner } from "./entities";
import { TagsModule } from "../tags";
import { UsersModule } from "../users";
import { ProfilesModule } from "../profiles";

@Module({
  imports: [
    TypeOrmModule.forFeature([Learner]),
    UsersModule,
    ProfilesModule,
    TagsModule,
  ],
  controllers: [LearnersController],
  providers: [LearnersService],
  exports: [LearnersService],
})
export class LearnersModule {}
