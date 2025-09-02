// user.controller.ts
import { JsonController, Post, UploadedFile, UploadedFiles, Body } from 'routing-controllers';
import { Express } from 'express';
import { Service } from 'typedi';
import { memoryOption } from '../../shared/multer';
import { ResizingService } from './resizing.service';
import { ResizeOptions } from '../../shared/sharpUtils';

@Service()
@JsonController('/resizing')
export class ResizingController {
  constructor(
    private readonly resizingService: ResizingService
  ) {}

  @Post('/single')
  async resizeFile(
    @UploadedFile('image', memoryOption) file: Express.Multer.File, 
    @Body() options: ResizeOptions){
    return await this.resizingService.resizeFile(file, options);
  }

  @Post('/multiple')
  async resizeFiles(
    @UploadedFiles('images', memoryOption) files: Express.Multer.File[],
    @Body() options: ResizeOptions){
    return await this.resizingService.resizeFiles(files, options);
  }
}