import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import {
  CreateSubmissionDecorator,
  DeleteSubmissionDecorator,
  GetAllSubmissionsDecorator,
  GetSubmissionByIdDecorator,
  UpdateSubmissionDecorator,
} from './decorators';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @CreateSubmissionDecorator()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createSubmissionDto: CreateSubmissionDto) {
    return this.submissionsService.create(createSubmissionDto);
  }

  @Get()
  @GetAllSubmissionsDecorator()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.submissionsService.findAll();
  }

  @Get(':id')
  @GetSubmissionByIdDecorator()
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.submissionsService.findOne(+id);
  }

  @Patch(':id')
  @UpdateSubmissionDecorator()
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ) {
    return this.submissionsService.update(+id, updateSubmissionDto);
  }

  @Delete(':id')
  @DeleteSubmissionDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.submissionsService.remove(+id);
  }
}
