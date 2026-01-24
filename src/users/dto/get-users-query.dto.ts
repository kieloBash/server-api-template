import { IsOptional, IsString } from 'class-validator';
import { PaginatedQueryDto } from 'src/common/interfaces';

export class GetUsersQueryDto extends PaginatedQueryDto {
    @IsOptional()
    @IsString()
    search?: string; // filter by name/email

    @IsOptional()
    @IsString()
    role?: string; // filter by role
}
