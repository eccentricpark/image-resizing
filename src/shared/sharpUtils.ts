export interface ResizeOptions{
  width : string;
  height : string;
}

export function parseOptions(options: ResizeOptions){
  const {width, height} = options;
  return {
    width: parseInt(width),
    height: parseInt(height),
  };
}

export function isFalse(param?: number){
  return (param === 0);
}

export function getState(options: ResizeOptions){
  const {width, height} = parseOptions(options);

  // width, height에 맞춰 조절
  if(!isFalse(width) && !isFalse(height)) 
    return 0;

  // width에 맞춰 조절
  else if(!isFalse(width)) 
    return 1;

  // height에 맞춰 조절
  else if(!isFalse(height)) 
    return 2;

  // 둘 다 입력 안하면
  else 
    return 3;
}

export function getFilename(originalname: string){
  return `${originalname.substring(0, originalname.lastIndexOf('.'))}.jpg`
}