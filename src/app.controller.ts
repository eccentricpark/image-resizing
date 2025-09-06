// user.controller.ts
import { JsonController, Get } from 'routing-controllers';
import { Service } from 'typedi';

@Service()
@JsonController('/')
export class AppController {
  constructor() {}

  @Get('/')
  sayHello() {
    return `Welcome to resizing-server`;
  }
}