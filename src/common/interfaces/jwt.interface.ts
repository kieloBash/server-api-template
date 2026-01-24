import { Role } from "src/generated/prisma/client";

export interface IJwtPayload {
    sub: string;
    email: string;
    role: Role;
}