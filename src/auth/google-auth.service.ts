import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleAuthService {
    private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    async verifyIdToken(idToken: string) {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            return ticket.getPayload();
        } catch (err) {
            throw new UnauthorizedException('Invalid Google token');
        }
    }
}
