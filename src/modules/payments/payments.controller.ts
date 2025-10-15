import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, PaymentResponseDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import {
  CreatePaymentDecorator,
  DeletePaymentDecorator,
  GetAllPaymentsDecorator,
  GetPaymentByIdDecorator,
} from './decorators';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @CreatePaymentDecorator()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    return this.paymentsService.create(dto);
  }

  @Get()
  @GetAllPaymentsDecorator()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<PaymentResponseDto[]> {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  @GetPaymentByIdDecorator()
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<PaymentResponseDto> {
    return this.paymentsService.findOne(+id);
  }

  @Delete(':id')
  @DeletePaymentDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    return this.paymentsService.remove(+id);
  }
}
