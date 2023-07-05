import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(@Body() dto: AuthDto) {
        console.log({
            dto: dto,
        });
        return this.authService.signup(dto);
    }

    // 1 framework dependent
    // signup(@Req() req: Request) {
    //    console.log(req.body);
    // }

    // 2 with pipes
    // signup(@Body('email') email: string, @Body('password', <Pipe>) password: string) {
    //     console.log({
    //         email,
    //         typeOfEmail: typeof email,
    //         password,
    //         typeOfPassword: typeof password
    //     });
    // }


    @Post('login')
    login(@Body() dto: AuthDto) {
        return this.authService.login(dto);
    }
}