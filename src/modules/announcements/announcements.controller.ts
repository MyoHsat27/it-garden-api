import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import {
  AnnouncementResponseDto,
  CreateAnnouncementDto,
  GetAnnouncementsQueryDto,
} from './dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards';
import { PaginatedResponseDto } from '../../common';

@Controller('announcements')
@UseGuards(JwtAuthGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Req() req: Request,
    @Body() createAnnouncementDto: CreateAnnouncementDto,
  ) {
    return this.announcementsService.create(
      createAnnouncementDto,
      req?.user as any,
    );
  }

  @Get('filtered')
  @HttpCode(HttpStatus.OK)
  async findAllAnnouncementsWithFilters(
    @Query() query: GetAnnouncementsQueryDto,
  ): Promise<PaginatedResponseDto<AnnouncementResponseDto>> {
    return this.announcementsService.findAllAnnouncementsWithFilters(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.announcementsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.announcementsService.remove(+id);
  }
}
