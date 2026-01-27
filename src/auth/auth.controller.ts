import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';

@Public()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const user = await this.authService.validateUser(body.email, body.password);
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() body: { email: string; password: string }) {
        return await this.authService.register(body);
    }

    @Post('google')
    async googleLogin(@Body('idToken') idToken: string) {
        return this.authService.googleLogin(idToken);
    }

    @Post('verify-otp')
    async verifyOtp(@Body() body: { email: string; token: string }) {
        return this.authService.verifyEmailOtp(body.email, body.token);
    }
}
