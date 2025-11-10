import { Role } from "../../role/models/role.model";

export interface User {
    id: number;
    email: string;
    passwordHash: string;
    emailVerified: boolean;
    emailVerifiedAt: string | null;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    avatarUrl?: string;
    isActive: boolean;
    isDeleted: boolean;
    deletedAt?: string;
    lastLoginAt?: string;
    failedLoginAttempts?: number;
    lockedUntil?: string;
    passwordChangedAt?: string;
    createdAt?: string;
    updatedAt?: string;

    userRoles?: Role[];
}