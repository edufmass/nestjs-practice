import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.CREATED) // or HttpCode(201)
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

    @HttpCode(HttpStatus.OK) // or HttpCode(200)
    @Post('login')
    login(@Body() dto: AuthDto) {
        return this.authService.login(dto);
    }
}