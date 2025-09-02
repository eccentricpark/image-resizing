import { Service } from "typedi";
import { ResizeOptions, parseOptions, getState} from '../../shared/sharpUtils';
import sharp from 'sharp';

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

  private async resizeToConvert(file: Express.Multer.File, width: number, height: number, state: number){
    const filename = this.getFilename(file.originalname);
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

  private getFilename(originalname: string){
    return `${originalname.substring(0, originalname.lastIndexOf('.'))}.jpg`
  }
}