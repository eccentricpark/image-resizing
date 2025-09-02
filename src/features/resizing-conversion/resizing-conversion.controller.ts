// user.controller.ts
import { JsonController, Post, UploadedFiles, Body, Res } from 'routing-controllers';
import { Express, Response } from 'express';
import { Service } from 'typedi';
import { memoryOption } from '../../shared/multer';
import { ResizingConversionService } from './resizing-conversion.service';
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

  /**
   * 파일 다운로드 기능을 추가한다.
   * 기존의 앤드포인트들은 postman에서 테스트했음.
   * 
   * 이 앤드포인트는 웹페이지에서 이미지 파일 업로드 시,
   * width, height에 맞춰 조절 및 jpg 변환 후, zip파일로 압축하여
   * 다운로드 기능을 지원하도록 구현해야 한다.
   */
  @Post('/multiple-download')
  async resizeAndArchive(
    @UploadedFiles('images', memoryOption) files: Express.Multer.File[],
    @Body() options: ResizeOptions,
    @Res() res: Response){
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=converted_images.zip');
    await this.service.resizeAndArchive(res, files, options);

    return res;
  }
}