import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Query,
  Res,
  NotFoundException,
  StreamableFile,
  Logger,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import {
  CreateAssignmentDecorator,
  DeleteAssignmentDecorator,
  GetAllAssignmentsDecorator,
  GetAssignmentByIdDecorator,
  UpdateAssignmentDecorator,
} from './decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssignmentResponseDto, GetAssignmentsQueryDto } from './dto';
import { PaginatedResponseDto } from '../../common';
import { StudentAssignmentResponseDto } from './dto/student-assignment-response.dto';
import { join } from 'path';
import { createReadStream, existsSync, statSync } from 'fs';
import { Response } from 'express';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly service: AssignmentsService) {}

  @Post()
  @CreateAssignmentDecorator()
  @UseInterceptors(FileInterceptor('attachment'))
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateAssignmentDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<AssignmentResponseDto> {
    return this.service.createAssignment(dto, file);
  }

  @Get()
  @GetAllAssignmentsDecorator()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.service.findAll();
  }

  @Get('filtered')
  @HttpCode(HttpStatus.OK)
  async GetAllAssignmentsWithFilters(
    @Query() query: GetAssignmentsQueryDto,
  ): Promise<PaginatedResponseDto<AssignmentResponseDto>> {
    return this.service.findAllAssignmentsWithFilters(query);
  }

  @Get('students/filtered')
  @HttpCode(HttpStatus.OK)
  async GetAllStudentsAssignmentsWithFilters(
    @Query() query: GetAssignmentsQueryDto,
  ): Promise<PaginatedResponseDto<StudentAssignmentResponseDto>> {
    return this.service.findAllStudentAssignmentsWithFilters(query);
  }

  @Get(':id')
  @GetAssignmentByIdDecorator()
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @UpdateAssignmentDecorator()
  @UseInterceptors(FileInterceptor('attachment'))
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: number, @Body() dto: UpdateAssignmentDto) {
    return this.service.updateAssignment(id, dto);
  }

  @Delete(':id')
  @DeleteAssignmentDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
  @Get('download/:id')
  async downloadAttachment(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const assignment = await this.service.findOne(id);
    if (!assignment.media) {
      throw new NotFoundException('Media not found');
    }

    const filePath = join(process.cwd(), 'uploads', assignment.media.key);
    const logger = new Logger('TEST');
    logger.log(filePath);
    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }
    const fileStats = statSync(filePath);
    const fileName = assignment.media.altText ?? assignment.media.key;
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': fileStats.size,
    });

    const fileStream = createReadStream(filePath);
    return new StreamableFile(fileStream);
  }
}
