import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  healthCheck(): string {
    return 'Api is online!';
  }

  @Get("/users")
  getUsers() {
    return this.appService.getUsers();
  }
}
