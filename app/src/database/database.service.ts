import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient {
    constructor() {
        super({
            datasources: {
                db: {
                    url: 'postgresql://nestjs_test-usr:nestjs_124713@nestjs-test-db:5432/nestjs_test?schema=public'
                }
            }
        })
    }
}
