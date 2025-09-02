// user.controller.ts
import { JsonController, Post, UploadedFile, UploadedFiles } from 'routing-controllers';
import { Service } from 'typedi';
import { memoryOption } from '../../shared/multer';
import { ConversionService } from './conversion.service';

@Service()
@JsonController('/conversion')
export class ConversionController {
  constructor(
    private readonly conversionService: ConversionService
  ) {}

  @Post('/single')
  async convertFile(@UploadedFile('image', memoryOption) file: Express.Multer.File) {
    return await this.conversionService.convertFile(file);
  }

  @Post('/multiple')
  async convertFiles(@UploadedFiles('images', memoryOption) files: Express.Multer.File[]){
    return await this.conversionService.convertFiles(files);
  }
}