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
}
