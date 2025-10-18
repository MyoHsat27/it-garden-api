import {
  BadRequestException,
  Injectable,
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
      const { url } = await this.storageService.upload(file, 'assignments');

      const media = await this.mediasRepository.create({
        url,
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
      const { url } = await this.storageService.upload(file, 'assignments');
      const media = await this.mediasRepository.create({
        url,
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

  async remove(id: number): Promise<void> {
    const affected = await this.repository.delete(id);
    if (affected === 0) {
      throw new NotFoundException(`Assignment with id ${id} not found`);
    }
  }
}
