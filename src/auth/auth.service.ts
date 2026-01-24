import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/generated/prisma/client';
import { DatabaseService } from 'src/lib/db.service';
import { verifyPassword } from 'src/utils/hash';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly db: DatabaseService,
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
}
