import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';

@Injectable({})
export class AuthService {
    constructor(
        private db:DatabaseService
    ) {}

    async signup(dto: AuthDto) {
        const hash = await argon.hash(dto.password);
        const user = await this.db.user.create({
            data: {
                email: dto.email,
                password: hash
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                updatedAt: true,
                createdAt: true
            }
        });

        return {
            msg: 'Signed up correctly!',
            user
        };
    }

    login() {
        return { msg: 'You are logged in.' };
    }
}