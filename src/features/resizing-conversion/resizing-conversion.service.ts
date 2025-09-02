import { Service } from "typedi";
import { Express, Response } from "express";
import { ResizeOptions, parseOptions, getState, getFilename} from '../../shared/sharpUtils';
import sharp from 'sharp';
import archiver from 'archiver';

@Service()
export class ResizingConversionService{
  constructor(){}

  async resizeToConvertFiles(files: Express.Multer.File[], options: ResizeOptions){
    const {width, height} = parseOptions(options);
    const state = getState(options);

    for (const file of files){
      await this.resizeToConvert(file, width, height, state);
    }
    return "Multiple OK";
  }

  async resizeAndArchive(res: Response, files: Express.Multer.File[], options: ResizeOptions){
    const {width, height} = parseOptions(options);
    const state = getState(options);

    const archive = archiver('zip', {
      zlib: { level: 9}
    });

    archive.on('error', function(error){
      console.log("ZIP 압축 실패");
      throw error;
    });

    archive.pipe(res);

    for (const file of files) {
      const imageBuffer = await this.resizeToConvert2(file, width, height, state);
      if (imageBuffer){
        const filename = getFilename(file.originalname);
        archive.append(imageBuffer, { name: `${filename}`});
      }
    }

    await archive.finalize();
    
  }

  private async resizeToConvert(file: Express.Multer.File, width: number, height: number, state: number){
    const filename = getFilename(file.originalname);
    const path = `./_converted/${filename}`;
    switch(state){
      case 0:
        await sharp(file.buffer).resize({
          width: width,
          height: height,
          fit: "fill"
        })
        .jpeg({ quality: 90 })
        .toFile(path);
        break;
      case 1:
        await sharp(file.buffer).resize({
          width: width
        })
        .jpeg({ quality: 90 })
        .toFile(path);
        break;
      case 2:
        await sharp(file.buffer).resize({
          height: height
        })
        .jpeg({ quality: 90 })
        .toFile(path);
        break;
      default:
        return "width, height 둘 중 하나는 자연수를 넣어 이 새꺄";
    }
  }

  private async resizeToConvert2(file: Express.Multer.File, width: number, height: number, state: number) : Promise<Buffer | string>{
    let sharpInstance;
    switch(state){
      case 0:
        sharpInstance = await sharp(file.buffer).resize({
          width: width,
          height: height,
          fit: "fill"
        });
        break;
      case 1:
        sharpInstance = await sharp(file.buffer).resize({
          width: width
        });
        break;
      case 2:
        sharpInstance = await sharp(file.buffer).resize({
          height: height
        });
        break;
      default:
        return "width, height 둘 중 하나는 자연수를 넣어 이 새꺄";
    }

    return sharpInstance
      .jpeg({ quality:90 })
      .toBuffer();
  }
}