import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Patch,
  Put,
  Query,
  Logger,
} from '@nestjs/common';
import { BatchesService } from './batches.service';
import { BatchResponseDto, CreateBatchDto, UpdateBatchDto } from './dto';
import {
  CreateBatchDecorator,
  GetAllBatchesDecorator,
  GetBatchByIdDecorator,
  UpdateBatchDecorator,
  DeleteBatchDecorator,
} from './decorators/swagger.decorator';
import { JwtAuthGuard } from '../auth/guards';
import { plainToInstance } from 'class-transformer';
import { GetBatchesQueryDto } from './dto/get-batches-query.dto';
import { PaginatedResponseDto } from '../../common';

@Controller('batches')
@UseGuards(JwtAuthGuard)
export class BatchesController {
  constructor(private readonly service: BatchesService) {}

  @Post()
  @CreateBatchDecorator()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateBatchDto): Promise<BatchResponseDto> {
    const batch = await this.service.create(dto);
    return plainToInstance(BatchResponseDto, batch);
  }

  @Get()
  @GetAllBatchesDecorator()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<BatchResponseDto[]> {
    const batches = await this.service.findAll();
    return plainToInstance(BatchResponseDto, batches);
  }

  @Get('filtered')
  @GetAllBatchesDecorator()
  @HttpCode(HttpStatus.OK)
  async findAllBatchesWithFilters(
    @Query() query: GetBatchesQueryDto,
  ): Promise<PaginatedResponseDto<BatchResponseDto>> {
    return this.service.findAllBatchesWithFilters(query);
  }

  @Get(':id')
  @GetBatchByIdDecorator()
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<BatchResponseDto> {
    const batch = await this.service.findOne(id);
    return plainToInstance(BatchResponseDto, batch);
  }

  @Put(':id')
  @UpdateBatchDecorator()
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateBatchDto,
  ): Promise<BatchResponseDto> {
    const batch = await this.service.update(id, dto);
    return plainToInstance(BatchResponseDto, batch);
  }

  @Delete(':id')
  @DeleteBatchDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    return await this.service.remove(+id);
  }
}
