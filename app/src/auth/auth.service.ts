import { ForbiddenException, Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable({})
export class AuthService {
    constructor(
        private db:DatabaseService,
        private jwt:JwtService,
        private config:ConfigService
    ) {}

    async signup(dto: AuthDto) {
        const hash = await argon.hash(dto.password);
        try {
            const user = await this.db.user.create({
                data: {
                    email: dto.email,
                    password: hash
                }
            });

            //return {
            //    msg: 'Signed up correctly!',
            //    user
            //};
            return this.signToken(user.id, user.email);
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

        //delete user.password;
        //return {
        //    msg: 'You are logged in.',
        //    user
        //};
        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string): Promise<{access_token: string}> {
        const payload = {
            sub: userId,
            email
        }
        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret
        },
        );

        return {
            access_token: token
        };
    }
}