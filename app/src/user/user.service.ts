import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UserService {

    constructor(private db: DatabaseService) {}

    async editUser(userId: number, dto: EditUserDto) {
        const user = await this.db.user.update({
            where: {
                id: userId
            },
            data: {
                ...dto
            }
        });

        delete user.password;
        return user;
    }
}
