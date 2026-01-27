import { Module } from '@nestjs/common';
import { OtpTokensService } from './otp-tokens.service';
import { DatabaseService } from 'src/lib/db.service';

@Module({
    providers: [OtpTokensService, DatabaseService],
    exports: [OtpTokensService],
})
export class OtpTokensModule { }
