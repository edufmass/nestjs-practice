import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateBookmarDto, EditBookmarDto } from './dto';

@Injectable()
export class BookmarkService {

    constructor( private db: DatabaseService) {

    }

    async createBookmark(userId: number, dto: CreateBookmarDto) {
        const bookmark = await this.db.bookmark.create({
            data: {
                userId,
                ...dto
            }
        });

        return bookmark;
    }
    
    getBookmarks(userId: number) {
        return this.db.bookmark.findMany({
            where: {
                userId, // userId: userId
            }
        });
    }

    getBookmarkById(userId: number, bookmarkId: number) {
        return this.db.bookmark.findFirst({
            where: {
                id: bookmarkId,
                userId,
            }
        });
    }

    async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarDto) {
        const bookmak = await this.db.bookmark.findUnique({
            where: {
                id: bookmarkId,
            }
        });

        if(!bookmak || bookmak.userId !== userId)
        throw new ForbiddenException('Access to resource denied');
        
        return this.db.bookmark.update({
            where: {
                id: bookmarkId,
            },
            data: {
                ...dto,
            }
        });
    }

    async deleteBookmarkById(userId: number, bookmarkId: number) {
        const bookmak = await this.db.bookmark.findUnique({
            where: {
                id: bookmarkId,
            }
        });

        if(!bookmak || bookmak.userId !== userId)
        throw new ForbiddenException('Access to resource denied');

        await this.db.bookmark.delete({
            where: {
                id: bookmarkId,
            }
        });
    }
}
