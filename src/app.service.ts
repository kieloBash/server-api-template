import { Injectable } from '@nestjs/common';
import { DatabaseService } from './lib/db.service';

@Injectable()
export class AppService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) { }

  async getUsers() {
    return await this.databaseService.user.findMany();
  }
}
