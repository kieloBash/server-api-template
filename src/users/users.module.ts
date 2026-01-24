import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/lib/db.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [],
  providers: [UsersService, DatabaseService],
  controllers: [UsersController]
})
export class UsersModule { }
