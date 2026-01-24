import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginatedQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1; // default page 1

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10; // default 10 items per page

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    paginated?: boolean = true; // true = paginated, false = return all
}
