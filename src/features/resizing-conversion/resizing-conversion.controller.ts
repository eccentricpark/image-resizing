// user.controller.ts
import { JsonController, Post, UploadedFiles, Body } from 'routing-controllers';
import { Express } from 'express';
import { Service } from 'typedi';
import { memoryOption } from '../../shared/multer';
import { ResizingConversionService } from './resizing-conversion.service.';
import { ResizeOptions } from '../../shared/sharpUtils';

@Service()
@JsonController('/resizing-conversion')
export class ResizingConversionController {
  constructor(
    private readonly service: ResizingConversionService
  ) {}

  @Post('/multiple')
  async resizeToConvertFiles(
    @UploadedFiles('images', memoryOption) files: Express.Multer.File[],
    @Body() options: ResizeOptions){
    return await this.service.resizeToConvertFiles(files, options);
  }
}