import { BadRequestException } from '@nestjs/common';
import { ALLOWED_MIMES, ALLOWED_EXT } from '../constants';

export function validateArchive(file: Express.Multer.File) {
  const lower = (file.originalname || '').toLowerCase();
  const ext = lower.slice(lower.lastIndexOf('.'));
  if (!ALLOWED_EXT.includes(ext)) {
    throw new BadRequestException(
      'Only archive files are allowed (zip, rar, 7z)',
    );
  }
  if (!ALLOWED_MIMES.includes(file.mimetype)) {
    throw new BadRequestException('Invalid file type');
  }
}
