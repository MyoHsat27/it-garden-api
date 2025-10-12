import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Learner } from "./entities";
import { DataSource, EntityManager, Repository } from "typeorm";
import { User } from "../users/entities";
import { OnboardLearnerDto } from "./dto";
import { UsersService } from "../users/users.service";
import { TagsService } from "../tags/tags.service";
import { Profile } from "../profiles/entities";
import { ProfilesService } from "../profiles/profiles.service";

@Injectable()
export class LearnersService {
  constructor(
    @InjectRepository(Learner) private repo: Repository<Learner>,
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
    private readonly profilesService: ProfilesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    data: { fullName: string; user: User },
    entityManager?: EntityManager,
  ): Promise<Learner> {
    const newLearner = this.repo.create(data);

    const manager = entityManager || this.repo.manager;

    return manager.save(newLearner);
  }

  async findByEmail(email: string): Promise<Learner | null> {
    return this.repo.findOne({
      where: { user: { email: email.toLowerCase() } },
      relations: ["user"],
    });
  }

  async onboard(userId: number, dto: OnboardLearnerDto): Promise<Learner> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.usersService.findById(userId);
      if (!user) throw new NotFoundException("User not found.");
      if (user.hasCompletedOnboarding)
        throw new ConflictException("User has already completed onboarding.");

      const learner = await queryRunner.manager.findOne(Learner, {
        where: { userId: user.id },
        relations: ["profile"],
      });

      if (!learner)
        throw new ForbiddenException("No learner profile found for this user.");
      if (!learner.profile) {
        learner.profile = new Profile();
      }

      const interests = await this.tagsService.findInterestsByIds(
        dto.interestIds,
      );

      if (interests.length !== dto.interestIds.length) {
        const foundIds = interests.map((i) => i.id);
        const invalidIds = dto.interestIds.filter(
          (id) => !foundIds.includes(id),
        );
        throw new BadRequestException(
          `Invalid tag IDs provided: ${invalidIds.join(", ")}`,
        );
      }

      await this.profilesService.setAvatarForProfile(
        learner.profile,
        dto.avatarId,
      );

      learner.age = dto.age;
      learner.gender = dto.gender;
      learner.bio = dto.bio || null;
      learner.educationLevel = dto.educationLevel;
      learner.interests = interests;

      user.hasCompletedOnboarding = true;

      await queryRunner.manager.save(learner.profile);
      await queryRunner.manager.save(learner);
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();

      const updatedLearner = await this.repo.findOne({
        where: { id: learner.id },
        relations: ["profile.avatar.media", "interests", "user"],
      });

      if (!updatedLearner)
        throw new InternalServerErrorException(
          "Failed to create learner profile.",
        );

      return updatedLearner;
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
