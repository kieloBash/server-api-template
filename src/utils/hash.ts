import * as bcrypt from 'bcrypt';

const saltRounds = 10;
const plainPassword = 'supersecret';

export async function hashPassword(password: string) {
    const hashed = await bcrypt.hash(password, saltRounds);
    return hashed;
}

export async function verifyPassword(plain: string, hashed: string) {
    const match = await bcrypt.compare(plain, hashed);
    return match;
}