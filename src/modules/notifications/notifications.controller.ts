import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findMine(@Req() req: Request) {
    return this.notificationsService.findByUser(req.user as any);
  }

  @Patch(':id/read')
  async markRead(@Param('id') id: number, @Req() req: Request) {
    return this.notificationsService.markAsRead(id, req.user as any);
  }
}
