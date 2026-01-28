import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/lib/db.service';
import { PasswordTokensService } from './password-tokens.service';

@Module({
  providers: [PasswordTokensService, DatabaseService],
  exports: [PasswordTokensService],
})
export class PasswordTokensModule { }
