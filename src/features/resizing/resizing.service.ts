import { Service } from "typedi";
import { ResizeOptions } from './resizing.interface';
import sharp from 'sharp';

@Service()
export class ResizingService{
  constructor(){}

  // 파일 하나 크기 조절
  async resizeFile(file: Express.Multer.File, options: ResizeOptions){
    const {width, height} = this.parseOptions(options);
    const state = this.getState(options);
    await this.resize(file, width, height, state);

    return "Single OK";
  }

  // 파일 다수 크기 조절
  async resizeFiles(files: Express.Multer.File[], options: ResizeOptions){
    const {width, height} = this.parseOptions(options);
    const state = this.getState(options);

    for(const file of files){
      await this.resize(file, width, height, state);
    }
    return "Multiple OK";
  }

  async resizeToConvertFiles(files: Express.Multer.File[], options: ResizeOptions){
    const {width, height} = this.parseOptions(options);
    const state = this.getState(options);

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

  private async resize(file: Express.Multer.File, width: number, height: number, state: number){
    const path = `./_uploaded/${file.originalname}`;
    switch(state){
      case 0:
        await sharp(file.buffer).resize({
          width: width,
          height: height,
          fit: "fill"
        }).toFile(path);
        break;
      case 1:
        await sharp(file.buffer).resize({
          width: width
        }).toFile(path);
        break;
      case 2:
        await sharp(file.buffer).resize({
          height: height
        }).toFile(path);
        break;
      default:
        return "width, height 둘 중 하나는 자연수를 넣어 이 새꺄";
    }

  }

  // width, height 입력 유무에 따라 state 값으로 분기 처리
  private getState(options: ResizeOptions){
    const {width, height} = this.parseOptions(options);

    // width, height에 맞춰 조절
    if(!this.isFalse(width) && !this.isFalse(height)) 
      return 0;

    // width에 맞춰 조절
    else if(!this.isFalse(width)) 
      return 1;

    // height에 맞춰 조절
    else if(!this.isFalse(height)) 
      return 2;

    // 둘 다 입력 안하면
    else 
      return 3;
  }

  private parseOptions(options: ResizeOptions){
    const {width, height} = options;
    return {
      width: parseInt(width),
      height: parseInt(height),
    };
  }

  private isFalse(param?: number){
    return (param === 0);
  }

}