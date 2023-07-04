import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {
    login() {
        return { msg: 'You are logged in.' };
    }

    signup() {
        return { msg: 'Signed up correctly!' };
    }
}