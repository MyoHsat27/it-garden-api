import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { MediaType } from "@app/common";

export class MediaDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: "https://space.com/path/to/image.png" })
  @Expose()
  url: string;

  @ApiProperty({ enum: MediaType, example: MediaType.IMAGE })
  @Expose()
  type: MediaType;

  @ApiProperty({ required: false, example: "A vibrant abstract painting." })
  @Expose()
  altText: string;
}
