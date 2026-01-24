import { Prisma, PrismaClient } from 'src/generated/prisma/client';
import { PaginatedResult } from '../interfaces/pagination.interface';

export class PaginationService {
    constructor(private prisma: PrismaClient) { }

    /**
     * Generic paginated fetch
     * @param model Prisma model delegate, e.g., prisma.user
     * @param options 
     */
    async getPaginated<T extends any>(
        model: any,
        options: {
            page?: number;
            limit?: number;
            where?: Prisma.PrismaClientKnownRequestError | object;
            orderBy?: any;
        },
    ): Promise<PaginatedResult<T>> {
        const page = options.page ?? 1;
        const limit = options.limit ?? 10;

        const skip = (page - 1) * limit;

        const [total, items] = await Promise.all([
            model.count({ where: options.where }),
            model.findMany({
                where: options.where,
                orderBy: options.orderBy,
                skip,
                take: limit,
            }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            items,
            total,
            page,
            limit,
            totalPages,
        };
    }
}
