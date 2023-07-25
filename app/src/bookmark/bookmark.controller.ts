import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';
import { CreateBookmarDto, EditBookmarDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {

    constructor(private bookmarkService: BookmarkService) {

    }

    @Post()
    createBookmark(
        @GetUser('id') userId: number,
        @Body() dto: CreateBookmarDto
    ) {
        return this.bookmarkService.createBookmark(userId, dto);
    }
    
    @Get()
    getBookmarks(@GetUser('id') userId: number) {
        return this.bookmarkService.getBookmarks(userId);
    }

    @Get('/user/:id')
    getBookmarksByUserId(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.bookmarkService.getBookmarks(id);
    }

    @Get(':id')
    getBookmarkById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarKId: number
    ) {
        return this.bookmarkService.getBookmarkById(userId, bookmarKId);
    }

    @Patch(':id')
    editBookmarkById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number,
        @Body() dto: EditBookmarDto
    ) {
        return this.bookmarkService.editBookmarkById(userId, bookmarkId, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteBookmarkById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number
    ) {
        return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
    }
}
