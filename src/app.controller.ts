import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { AppInfoDto } from "@app/common/dto";

@Controller("app")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("info")
  @ApiOperation({ summary: "Get app information" })
  @ApiOkResponse({
    description: "Returns general information about the application",
    type: AppInfoDto,
  })
  getAppInfo(): AppInfoDto {
    return this.appService.getAppInfo();
  }

  @Get("hello")
  async getHello() {
    return this.appService.getHello();
  }
}
