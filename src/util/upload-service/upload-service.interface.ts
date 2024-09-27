export interface IUploadFactoryService {
  upload(file: Express.Multer.File): Promise<string | undefined>;
}
