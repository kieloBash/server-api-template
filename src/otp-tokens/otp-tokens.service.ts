import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import { DatabaseService } from 'src/lib/db.service';
import { generateRandomToken } from 'src/utils/token';

@Injectable()
export class OtpTokensService {

    constructor(
        private readonly db: DatabaseService,
    ) { }

    async createOtpToken(email: string) {
        const token = generateRandomToken();

        return this.db.otpToken.create({
            data: {
                email,
                token,
            },
        });
    }

    async verifyOtpToken(email: string, token: string) {
        const isValid = await this.isValidOtpToken(email, token);
        if (!isValid) {
            return false;
        }

        await this.db.otpToken.updateMany({
            where: {
                email,
                token,
            },
            data: {
                isUsed: true,
            }
        });

        return true;
    }

    private async isValidOtpToken(email: string, token: string) {
        const otpToken = await this.db.otpToken.findFirst({
            where: {
                email,
                token,
                createdAt: {
                    gte: new Date(Date.now() - 15 * 60 * 1000) // valid for 15 minutes
                },
                isUsed: false,
            }
        });

        return otpToken !== null;
    }

    async deleteOtpToken(email: string, token: string) {
        await this.db.otpToken.deleteMany({
            where: {
                email,
                token,
            }
        });
    }
}
