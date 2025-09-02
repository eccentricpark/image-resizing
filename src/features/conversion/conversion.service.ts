import { Service } from "typedi";
import sharp from 'sharp';
import { getFilename } from "../../shared/sharpUtils";

@Service()
export class ConversionService{
  constructor(){}

  async convertFile(file: Express.Multer.File){
    const filename = getFilename(file.originalname);
    await sharp(file.buffer).jpeg({
      quality: this.getQuality()
    }).toFile(`./_converted/${filename}`);
    return "convert single ok";
  }

  async convertFiles(files: Express.Multer.File[]){
    for (const file of files){
      const filename = getFilename(file.originalname);
      await sharp(file.buffer).jpeg({
        quality: this.getQuality()
      }).toFile(`./_converted/${filename}`);
    }
    return "convert multiple ok";
  }

  private getQuality(){
    return 90;
  }
}