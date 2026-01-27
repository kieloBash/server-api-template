import { PrismaPg } from '@prisma/adapter-pg';
import { hashPassword } from 'src/utils/hash';
import { PrismaClient } from '../src/generated/prisma/client';

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: pool });

async function main() {
    // --- Example Roles ---
    const adminRole = await prisma.role.upsert({
        where: { name: 'ADMIN' },
        update: {},
        create: { name: 'ADMIN' },
    });

    const userRole = await prisma.role.upsert({
        where: { name: 'USER' },
        update: {},
        create: { name: 'USER' },
    });

    console.log(`Roles are created: ${adminRole.name}, ${userRole.name}`);

    // --- Example Admin User ---

    const password = 'User1234!'
    const hashedPassword = await hashPassword(password);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@gmail.com' },
        update: {},
        create: {
            email: 'admin@gmail.com',
            name: 'Admin User',
            password: hashedPassword,
            verifiedAt: new Date(),
            role: {
                connect: { id: adminRole.id },
            },
        },
    });

    console.log(`Admin user created: ${admin.email} - ${password}`)

    console.log('Database seeded ✅');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
