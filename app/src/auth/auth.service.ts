import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { AuthDto } from "./dto";

@Injectable({})
export class AuthService {
    constructor(
        private db:DatabaseService
    ) {}

    login() {
        return { msg: 'You are logged in.' };
    }

    signup(dto: AuthDto) {
        return { msg: 'Signed up correctly!' };
    }
}