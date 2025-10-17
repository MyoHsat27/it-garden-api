import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({ isArray: true })
  data: T[];

  @ApiProperty()
  limit: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  hasPreviousPage: boolean;

  @ApiProperty()
  hasNextPage: boolean;

  constructor(data: T[], totalItems: number, page: number, limit: number) {
    this.data = data;
    this.limit = limit;
    this.page = page;
    this.totalItems = totalItems;
    this.totalPages = Math.ceil(totalItems / limit);
    this.hasPreviousPage = page > 1;
    this.hasNextPage = page < this.totalPages;
  }
}
