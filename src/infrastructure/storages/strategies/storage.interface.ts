export interface StorageStrategy {
  upload(
    file: Express.Multer.File,
    path?: string,
  ): Promise<{ url: string; key: string }>;
}
