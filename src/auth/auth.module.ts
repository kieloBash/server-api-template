import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseService } from 'src/lib/db.service';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleAuthService } from './google-auth.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'supersecret',
            signOptions: { expiresIn: '7d' },
        }),
    ],
    providers: [AuthService, DatabaseService, JwtStrategy, GoogleAuthService],
    controllers: [AuthController],
    exports: [AuthService, PassportModule, JwtModule],
})
export class AuthModule { }
