import { Body, Controller, Logger, Post, Req, UseGuards } from "@nestjs/common";
import { LearnersService } from "./learners.service";
import { CurrentUser } from "../users/decorators";
import { LearnerDto, OnboardLearnerDto } from "./dto";
import { OnboardLearnerDecorator } from "./decorators";
import { Serialize } from "@app/common";
import { Learner } from "./entities";
import { JwtAuthGuard } from "../auth/guards";

@Controller("learners")
export class LearnersController {
  constructor(private readonly learnersService: LearnersService) {}

  @Post("onboarding")
  @UseGuards(JwtAuthGuard)
  @OnboardLearnerDecorator()
  @Serialize(LearnerDto)
  async onboardLearner(
    @CurrentUser() user: any,
    @Body() dto: OnboardLearnerDto,
  ): Promise<Learner> {
    const logger = new Logger("CONTROLLER");
    logger.log(user);
    return await this.learnersService.onboard(user.id, dto);
  }
}
