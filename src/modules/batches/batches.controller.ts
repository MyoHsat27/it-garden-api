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

@Controller('batches')
@UseGuards(JwtAuthGuard)
export class BatchesController {
  constructor(private readonly service: BatchesService) {}

  @Post()
  @CreateBatchDecorator()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateBatchDto): Promise<BatchResponseDto> {
    return await this.service.create(dto);
  }

  @Get()
  @GetAllBatchesDecorator()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<BatchResponseDto[]> {
    return await this.service.findAll();
  }

  @Get(':id')
  @GetBatchByIdDecorator()
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<BatchResponseDto> {
    return await this.service.findOne(id);
  }

  @Patch(':id')
  @UpdateBatchDecorator()
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateBatchDto,
  ): Promise<BatchResponseDto> {
    return await this.service.update(id, dto);
  }

  @Delete(':id')
  @DeleteBatchDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    return await this.service.remove(+id);
  }
}
