import { User } from './../users/entities/user.entity';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AssignmentsRepository } from './assignments.repository';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { plainToInstance } from 'class-transformer';
import { AssignmentResponseDto, GetAssignmentsQueryDto } from './dto';
import { MediaType, PaginatedResponseDto, validateArchive } from '../../common';
import { BatchesRepository } from '../batches/batches.repository';
import { MediasRepository } from '../medias/medias.repository';
import { StorageService } from '../../infrastructure';
import { StudentAssignmentResponseDto } from './dto/student-assignment-response.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    private readonly repository: AssignmentsRepository,
    private readonly batchesRepository: BatchesRepository,
    private readonly mediasRepository: MediasRepository,
    private readonly storageService: StorageService,
  ) {}

  async createAssignment(dto: CreateAssignmentDto, file?: Express.Multer.File) {
    const batch = await this.batchesRepository.findById(Number(dto.batchId));
    if (!batch) throw new NotFoundException('Batch does not exists');

    const start = new Date(dto.startDate);
    const due = new Date(dto.dueDate);
    if (start > due)
      throw new BadRequestException('Start date must be before due date');

    const assignment = await this.repository.create({
      title: dto.title,
      description: dto.description,
      startDate: start,
      dueDate: due,
      batch,
    });

    if (file) {
      validateArchive(file);
      const { url, key } = await this.storageService.upload(
        file,
        'assignments',
      );

      const media = await this.mediasRepository.create({
        url,
        key,
        type: MediaType.ARCHIVE,
        mimeType: file.mimetype,
        size: file.size,
        altText: file.originalname,
      });

      assignment.media = media;
    }

    const updatedAssignment = await this.repository.save(assignment);

    return plainToInstance(AssignmentResponseDto, updatedAssignment);
  }

  async updateAssignment(
    id: number,
    dto: UpdateAssignmentDto,
    file?: Express.Multer.File,
  ) {
    const assignment = await this.repository.findById(id);
    if (!assignment) throw new NotFoundException('Assignment not found');

    if (dto.startDate) assignment.startDate = new Date(dto.startDate);
    if (dto.dueDate) assignment.dueDate = new Date(dto.dueDate);
    if (dto.title !== undefined) assignment.title = dto.title;
    if (dto.description !== undefined) assignment.description = dto.description;

    if (file) {
      const { url, key } = await this.storageService.upload(
        file,
        'assignments',
      );
      const media = await this.mediasRepository.create({
        url,
        key,
        type: MediaType.ARCHIVE,
        mimeType: file.mimetype,
        size: file.size,
        altText: file.originalname,
      });

      assignment.media = media;
    }

    const updatedAssignment = await this.repository.save(assignment);

    return plainToInstance(AssignmentResponseDto, updatedAssignment);
  }

  async findAll() {
    const assignments = await this.repository.findAll();
    return plainToInstance(AssignmentResponseDto, assignments);
  }

  async findOne(id: number) {
    const assignment = await this.repository.findById(id);
    if (!assignment)
      throw new NotFoundException(`Assignment with id ${id} not found`);

    return plainToInstance(AssignmentResponseDto, assignment);
  }

  async findAllAssignmentsWithFilters(query: GetAssignmentsQueryDto) {
    const result = await this.repository.findWithFilters(query);

    const data = result.data.map((a) =>
      plainToInstance(AssignmentResponseDto, a),
    );

    return new PaginatedResponseDto(
      data,
      result.totalItems,
      result.page,
      result.limit,
    );
  }

  // async findAllStudentAssignmentsWithFilters(query: GetAssignmentsQueryDto) {
  //   const result = await this.repository.findWithStudentFilters(query);

  //   const data = result.data.map((a) =>
  //     plainToInstance(StudentAssignmentResponseDto, a),
  //   );

  //   return new PaginatedResponseDto(
  //     data,
  //     result.totalItems,
  //     result.page,
  //     result.limit,
  //   );
  // }

  async findAllStudentAssignmentsWithFilters(query: GetAssignmentsQueryDto) {
    const result = await this.repository.findWithStudentFilters(query);

    const data = result.data.map((a) => {
      const submission = a.submissions?.[0] || null;
      const status = submission ? 'SUBMITTED' : 'PENDING';

      return plainToInstance(StudentAssignmentResponseDto, {
        id: a.id,
        title: a.title,
        description: a.description,
        startDate: a.startDate,
        dueDate: a.dueDate,
        status,
        media: a.media,
        submission,
        courseName: a.batch?.course?.name ?? null,
        teacherName: a.batch?.teacher?.fullName ?? null,
        batchName: a.batch?.name ?? null,
      });
    });

    return new PaginatedResponseDto(
      data,
      result.totalItems,
      result.page,
      result.limit,
    );
  }

  async remove(id: number): Promise<void> {
    const affected = await this.repository.delete(id);
    if (affected === 0) {
      throw new NotFoundException(`Assignment with id ${id} not found`);
    }
  }
}
