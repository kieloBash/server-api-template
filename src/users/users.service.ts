import { Injectable } from '@nestjs/common';
import { PaginationService } from 'src/common/services/pagination.service';
import { DatabaseService } from 'src/lib/db.service';
import { GetUsersQueryDto } from './dto/get-users-query.dto';

@Injectable()
export class UsersService {
    private paginationService: PaginationService;

    constructor(
        private readonly databaseService: DatabaseService,
    ) {
        this.paginationService = new PaginationService(this.databaseService);
    }

    private async getPaginatedUsers(query: any) {
        const { page, limit, search, role } = query;

        // Build Prisma where filter dynamically
        const where: any = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (role) {
            where.role = {
                name: role,
            };
        }

        console.log(where)

        return this.paginationService.getPaginated(this.databaseService.user, {
            page,
            limit,
            where,
            orderBy: { createdAt: 'desc' }, // example
        });
    }

    async getUsers(query: GetUsersQueryDto) {
        return this.getPaginatedUsers(query);
    }
}
