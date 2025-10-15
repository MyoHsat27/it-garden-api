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

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly service: AssignmentsService) {}

  @Post()
  @CreateAssignmentDecorator()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateAssignmentDto) {
    return this.service.create(dto);
  }

  @Get()
  @GetAllAssignmentsDecorator()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @GetAssignmentByIdDecorator()
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @UpdateAssignmentDecorator()
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: number, @Body() dto: UpdateAssignmentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @DeleteAssignmentDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
