import { ForbiddenException, Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable({})
export class AuthService {
    constructor(
        private db:DatabaseService
    ) {}

    async signup(dto: AuthDto) {
        const hash = await argon.hash(dto.password);
        try {
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
        } catch(error) {
            if(error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException(
                        'Email error, try another.',
                    );
                }
            }
            throw error;
        }
    }

    async login(dto: AuthDto) {
        const user = await this.db.user.findUnique({
            where: {
                email: dto.email,
            }
        });

        if(!user) throw new ForbiddenException(
            'Email error, try another.',
        );

        const passwdCorrect = await argon.verify(user.password, dto.password);

        if(!passwdCorrect) throw new ForbiddenException(
            'Email or password incorrect, try again.',
        );

        delete user.password;
        
        return {
            msg: 'You are logged in.',
            user
        };
    }
}