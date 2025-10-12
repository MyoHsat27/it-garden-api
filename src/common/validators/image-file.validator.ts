import { FileValidator, UnprocessableEntityException } from "@nestjs/common";
import * as sharp from "sharp";

export interface ImageFileValidatorOptions {
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
  fileType: string | RegExp;
}

export class ImageFileValidator extends FileValidator<ImageFileValidatorOptions> {
  constructor(protected readonly validationOptions: ImageFileValidatorOptions) {
    super(validationOptions);
  }

  async isValid(file: Express.Multer.File): Promise<boolean> {
    if (!file.mimetype.match(this.validationOptions.fileType)) {
      return false;
    }

    try {
      const image = sharp(file.buffer);
      const metadata = await image.metadata();

      if (
        this.validationOptions.minWidth &&
        metadata.width < this.validationOptions.minWidth
      ) {
        return false;
      }
      if (
        this.validationOptions.minHeight &&
        metadata.height < this.validationOptions.minHeight
      ) {
        return false;
      }
      if (
        this.validationOptions.maxWidth &&
        metadata.width > this.validationOptions.maxWidth
      ) {
        return false;
      }
      if (
        this.validationOptions.maxHeight &&
        metadata.height > this.validationOptions.maxHeight
      ) {
        return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  buildErrorMessage(file: any): string {
    const messages: string[] = [];
    if (!file.mimetype.match(this.validationOptions.fileType)) {
      messages.push(`File type must be ${this.validationOptions.fileType}.`);
    }

    if (this.validationOptions.minWidth) {
      messages.push(
        `Minimum width must be ${this.validationOptions.minWidth}px.`,
      );
    }

    if (this.validationOptions.maxWidth) {
      messages.push(
        `Maximum width must be ${this.validationOptions.maxWidth}px.`,
      );
    }

    if (this.validationOptions.minHeight) {
      messages.push(
        `Minimum height must be ${this.validationOptions.minHeight}px.`,
      );
    }

    if (this.validationOptions.maxHeight) {
      messages.push(
        `Maximum height must be ${this.validationOptions.maxHeight}px.`,
      );
    }

    throw new UnprocessableEntityException(messages.join(" "));
  }
}
