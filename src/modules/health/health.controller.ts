import { HealthCheckDto } from '@common';
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private configService: ConfigService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check health status' })
  @ApiOkResponse({
    description: 'Returns the health status of the application',
    type: HealthCheckDto,
  })
  public async check(): Promise<HealthCheckResult> {
    const port = this.configService.get<number>('PORT');

    return await this.health.check([
      async (): Promise<HealthIndicatorResult> =>
        await this.http.pingCheck('dns', 'https://1.1.1.1'),
      async (): Promise<HealthIndicatorResult> =>
        await this.db.pingCheck('database'),
      async (): Promise<HealthIndicatorResult> =>
        await this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      async (): Promise<HealthIndicatorResult> =>
        await this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      async (): Promise<HealthIndicatorResult> =>
        await this.http.pingCheck(
          'api-docs',
          `http://localhost:${port}/api-docs`,
        ),
      // async (): Promise<HealthIndicatorResult> =>
      //   await this.redis.pingCheck('redis'),
    ]);
  }
}
