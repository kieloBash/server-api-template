import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt.guard';
import { JwtPayload } from 'src/common/decorators/jwt-payload.decorator';
import { type IJwtPayload } from 'src/common/interfaces';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Get()
    getUsers() {
        return this.usersService.getUsers();
    }

    @UseGuards(JwtGuard)
    @Get('me')
    getProfile(@JwtPayload() jwt: IJwtPayload) {
        return {
            message: 'You are authenticated!',
            user: jwt,
        };
    }
}
