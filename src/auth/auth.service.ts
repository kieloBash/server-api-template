import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/generated/prisma/client';
import { DatabaseService } from 'src/lib/db.service';
import { verifyPassword } from 'src/utils/hash';
import { GoogleAuthService } from './google-auth.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly db: DatabaseService,
        private readonly googleAuthService: GoogleAuthService,
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.db.user.findUnique({ where: { email }, include: { role: true } });
        if (!user || !user.password) throw new UnauthorizedException('Invalid credentials');

        const passwordValid = await verifyPassword(password, user.password);
        if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

        return { id: user.id, email: user.email, role: user.role };
    }

    async login(user: { id: string; email: string; role: Role }) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
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
}
