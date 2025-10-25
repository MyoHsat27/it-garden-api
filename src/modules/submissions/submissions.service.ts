import { EnrollmentsRepository } from './../enrollments/enrollments.repository';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SubmissionsRepository } from './submissions.respository';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { plainToInstance } from 'class-transformer';
import { SubmissionResponseDto } from './dto/submission-response.dto';
import { AssignmentsRepository } from '../assignments/assignments.repository';
import { SubmissionStatus } from './enums';
import { MediaType, validateArchive } from '../../common';
import { StorageService } from '../../infrastructure';
import { MediasRepository } from '../medias/medias.repository';
import { GradeSubmissionDto } from './dto/grade-submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly repository: SubmissionsRepository,
    private readonly assignmentsRepository: AssignmentsRepository,
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly mediasRepository: MediasRepository,
    private readonly storageService: StorageService,
  ) {}

  async submitAssignment(
    studentId: number,
    dto: CreateSubmissionDto,
    file?: Express.Multer.File,
  ) {
    const assignment = await this.assignmentsRepository.findById(
      Number(dto.assignmentId),
    );
    if (!assignment) throw new NotFoundException('Assignment not found');

    const enrollment = await this.enrollmentsRepository.findByStudentAndBatch(
      studentId,
      assignment.batch.id,
    );
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    const existing = await this.repository.findByAssignmentAndEnrollment(
      assignment.id,
      enrollment.id,
    );
    if (existing)
      throw new BadRequestException(
        'Submission already exists for this student and assignment',
      );

    const sub = await this.repository.create({
      content: dto.content,
      submittedAt: new Date(),
      assignment,
      enrollment,
      status: SubmissionStatus.PENDING,
    });

    if (file) {
      validateArchive(file);
      const { url, key } = await this.storageService.upload(
        file,
        'submissions',
      );

      const media = await this.mediasRepository.create({
        url,
        key,
        type: MediaType.ARCHIVE,
        mimeType: file.mimetype,
        size: file.size,
        altText: file.originalname,
      });

      sub.media = media;
    }

    const updatedSubmission = await this.repository.save(sub);

    return plainToInstance(SubmissionResponseDto, updatedSubmission);
  }

  async gradeSubmission(id: number, dto: GradeSubmissionDto) {
    const sub = await this.repository.findById(id);
    if (!sub) throw new NotFoundException('Submission not found');

    sub.grade = dto.grade;
    sub.feedback = dto.feedback;
    if (dto.feedback !== undefined) sub.feedback = dto.feedback;
    sub.status = SubmissionStatus.GRADED;
    return this.repository.save(sub);
  }

  async getSubmissionsForAssignment(assignmentId: number) {
    const submissions = await this.repository.findAllByAssignment(assignmentId);
    return plainToInstance(SubmissionResponseDto, submissions);
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
}
