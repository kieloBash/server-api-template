import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/lib/db.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

    async getUsers() {
        return await this.databaseService.user.findMany();
    }
}
