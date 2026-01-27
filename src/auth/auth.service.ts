import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/generated/prisma/client';
import { DatabaseService } from 'src/lib/db.service';
import { MailService } from 'src/mail/mail.service';
import { OtpTokensService } from 'src/otp-tokens/otp-tokens.service';
import { hashPassword, verifyPassword } from 'src/utils/hash';
import { GoogleAuthService } from './google-auth.service';

@Injectable()
export class AuthService {
    private logger = new Logger(AuthService.name);

    constructor(
        private readonly jwtService: JwtService,
        private readonly db: DatabaseService,
        private readonly googleAuthService: GoogleAuthService,
        private readonly otpTokensService: OtpTokensService,
        private readonly mailService: MailService,
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.db.user.findUnique({ where: { email }, include: { role: true } });
        if (!user || !user.password) throw new UnauthorizedException('Invalid credentials');

        if (user.verifiedAt === null) {
            throw new BadRequestException('Email not verified, please verify your email before logging in');
        }

        const passwordValid = await verifyPassword(password, user.password);
        if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

        return { id: user.id, email: user.email, role: user.role };
    }

    async login(user: { id: string; email: string; role: Role }) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }

    async googleLogin(idToken: string) {
        const payload = await this.googleAuthService.verifyIdToken(idToken);
        if (!payload) {
            throw new UnauthorizedException('Invalid Google token payload');
        }

        const { sub, email, name, picture } = payload;

        let user = await this.db.user.findUnique({
            where: { email },
        });

        const role = await this.db.role.findUnique({ where: { name: 'USER' } });
        if (!role) {
            throw new UnauthorizedException('Default role not found');
        }

        if (email === null || email === undefined) {
            throw new UnauthorizedException('Email not provided by Google');
        }

        if (!user) {
            user = await this.db.user.create({
                data: {
                    email,
                    name,
                    profile: picture,
                    googleId: sub,
                    provider: "GOOGLE",
                    role: {
                        connect: { id: role.id }
                    }
                },
            });
        }

        const access_token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            role,
        });

        return {
            user,
            access_token,
        };
    }

    async register(userData: { email: string; password: string; name?: string, role?: Role }) {
        const existingUser = await this.db.user.findUnique({ where: { email: userData.email } });
        if (existingUser) {
            throw new BadRequestException('Email already in use');
        }

        const role = userData.role || await this.db.role.findUnique({ where: { name: 'USER' } });
        if (!role) {
            throw new BadRequestException('Default role not found');
        }

        try {
            const hashedPassword = await hashPassword(userData.password);
            const newUser = await this.db.user.create({
                data: {
                    email: userData.email,
                    password: hashedPassword,
                    name: userData.name,
                    role: {
                        connect: { id: role.id }
                    }
                },
            });

            // Add verification email logic here if needed
            const otpToken = await this.otpTokensService.createOtpToken(newUser.email);

            await this.mailService.sendMail(
                newUser.email,
                'Verify your email',
                `<p>Your verification code is: ${otpToken.token}</p>`
            );
            return { id: newUser.id, email: newUser.email, message: 'Registration successful, please verify your email' };
        } catch (error) {

            await this.db.user.deleteMany({ where: { email: userData.email } });
            await this.db.otpToken.deleteMany({ where: { email: userData.email } });

            this.logger.error('User registration rolled back');
            this.logger.error('Registration error: ', error);
            throw new BadRequestException('Registration failed');
        }

    }

    async verifyEmailOtp(email: string, token: string) {
        const isValid = await this.otpTokensService.verifyOtpToken(email, token);
        if (!isValid) {
            throw new BadRequestException('Invalid or expired OTP token');
        }

        await this.db.user.updateMany({
            where: { email },
            data: { verifiedAt: new Date() },
        });

        await this.otpTokensService.deleteOtpToken(email, token);

        return { message: 'Email verified successfully' };
    }
}
