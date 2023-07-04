import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";

@Injectable({})
export class AuthService {
    constructor(
        private db:DatabaseService
    ) {}

    login() {
        return { msg: 'You are logged in.' };
    }

    signup() {
        return { msg: 'Signed up correctly!' };
    }
}