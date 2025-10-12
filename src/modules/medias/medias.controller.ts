import { Controller } from "@nestjs/common";
import { MediasService } from "./medias.service";

@Controller("media")
export class MediasController {
  constructor(private readonly mediaService: MediasService) {}
}
