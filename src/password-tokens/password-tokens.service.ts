import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/lib/db.service';
import { generateRandomToken } from 'src/utils/token';

@Injectable()
export class PasswordTokensService {
    constructor(
        private readonly db: DatabaseService,
    ) { }

    async createToken(email: string) {
        const token = generateRandomToken();
        return this.db.passwordResetToken.create({
            data: {
                email,
                token,
            },
        });
    }

    async verifyToken(email: string, token: string) {
        const isValid = await this.isValidToken(email, token);
        if (!isValid) {
            return false;
        }
        return true;
    }

    private async isValidToken(email: string, token: string) {
        const passwordResetToken = await this.db.passwordResetToken.findFirst({
            where: {
                email,
                token,
                createdAt: {
                    gte: new Date(Date.now() - 15 * 60 * 1000) // valid for 15 minutes
                },
                isUsed: false,
            }
        });

        return passwordResetToken !== null;
    }

    async markTokenAsUsed(email: string, token: string) {
        await this.db.passwordResetToken.updateMany({
            where: {
                email,
                token,
            },
            data: {
                isUsed: true,
            }
        });
    }

    async deleteToken(email: string, token: string) {
        await this.db.passwordResetToken.deleteMany({
            where: {
                email,
                token,
            }
        });
    }
}
