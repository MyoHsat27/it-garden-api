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
  Res,
  StreamableFile,
  NotFoundException,
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
import { join } from 'path';
import { createReadStream, existsSync, statSync } from 'fs';
import { Response } from 'express';

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

  @Get('download/:id')
  async downloadAttachment(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const submission = await this.submissionsService.findOne(id);
    if (!submission.media) {
      throw new NotFoundException('Media not found');
    }

    const filePath = join(process.cwd(), 'uploads', submission.media.key);
    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }
    const fileStats = statSync(filePath);
    const fileName = submission.media.altText ?? submission.media.key;
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': fileStats.size,
    });

    const fileStream = createReadStream(filePath);
    return new StreamableFile(fileStream);
  }
}
