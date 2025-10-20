import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Put,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import {
  GetAllSubmissionsDecorator,
  GetSubmissionByIdDecorator,
} from './decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { GradeSubmissionDto } from './dto/grade-submission.dto';
import { CurrentUser } from '../users/decorators';
import { JwtAuthGuard } from '../auth/guards';

@Controller('submissions')
@UseGuards(JwtAuthGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('attachment'))
  @HttpCode(HttpStatus.CREATED)
  async submit(
    @CurrentUser() user: any,
    @Body() dto: CreateSubmissionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.submissionsService.submitAssignment(
      user.studentProfile.id,
      dto,
      file,
    );
  }

  @Get('/assignment/:id')
  async listSubmissions(@Param('id', ParseIntPipe) id: number) {
    return this.submissionsService.getSubmissionsForAssignment(id);
  }

  @Put(':id/grade')
  async gradeSubmission(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: GradeSubmissionDto,
  ) {
    return this.submissionsService.gradeSubmission(id, dto);
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
}
