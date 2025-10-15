import { Injectable, NotFoundException } from '@nestjs/common';
import { SubmissionsRepository } from './submissions.respository';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { plainToInstance } from 'class-transformer';
import { SubmissionResponseDto } from './dto/submission-response.dto';

@Injectable()
export class SubmissionsService {
  constructor(private readonly repository: SubmissionsRepository) {}

  async create(dto: CreateSubmissionDto) {
    const course = await this.repository.create(dto);
    return plainToInstance(SubmissionResponseDto, course);
  }

  async findAll() {
    const submissions = await this.repository.findAll();
    return plainToInstance(SubmissionResponseDto, submissions);
  }

  async findOne(id: number) {
    const submission = await this.repository.findById(id);
    if (!submission)
      throw new NotFoundException(`Submission with id ${id} not found`);
    return plainToInstance(SubmissionResponseDto, submission);
  }

  async update(id: number, dto: UpdateSubmissionDto) {
    const submission = await this.repository.findById(id);
    if (!submission)
      throw new NotFoundException(`Submission with id ${id} not found`);

    Object.assign(submission, dto);
    const updated = await this.repository.update(submission);
    return plainToInstance(SubmissionResponseDto, updated);
  }

  async remove(id: number): Promise<void> {
    const affected = await this.repository.delete(id);
    if (affected === 0) {
      throw new NotFoundException(`Submission with id ${id} not found`);
    }
  }
}
